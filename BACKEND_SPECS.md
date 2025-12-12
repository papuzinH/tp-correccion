# 📘 Especificación de Endpoints y Consultas SQL (Backend)

**Objetivo:** Implementar los servicios necesarios para el módulo de Corrección de TPs, optimizando la carga de datos mediante consultas jerárquicas JSON para reducir latencia.

**Tecnología:** PostgreSQL (Sintaxis compatible con versiones 9.4+ para funciones JSON).

---

## 1. Obtener Configuración del TP
**Endpoint:** `GetTPConfiguracionByIdActividadIdComision`
**Input:** `{ "idActividad": int, "idComision": int }`

### 📝 Descripción Funcional
Debe devolver la configuración específica del TP (consigna, adjuntos) combinada con las reglas de la comisión (fechas, escala, si es grupal).

### ⚡ Query SQL Sugerida
Realiza un `JOIN` entre `TPConfiguracion` y `ActividadComision`.

```sql
SELECT
    tpc."IdTPConfiguracion",
    ac."IdActividad",
    ac."IdEscala",
    ac."Alias",
    ac."FechaInicio",
    ac."FechaVencimiento",
    ac."PermiteEntregaFueraDeTermino",
    ac."EsGrupal",
    tpc."Consigna",
    tpc."ConsignaAdjuntos"
FROM "ActividadComision" ac
LEFT JOIN "TPConfiguracion" tpc ON ac."IdActividad" = tpc."IdActividad"
WHERE ac."IdActividad" = @idActividad 
  AND ac."IdComision" = @idComision;
```

---

## 2. Obtener Usuarios de la Comisión
**Endpoint:** `GetUsuariosByIdComision`
**Input:** `idComision` (int)

### 📝 Descripción Funcional
Devuelve la lista simple de alumnos inscritos en la comisión para mapear IDs a Nombres/Avatares en el frontend.

### ⚡ Query SQL Sugerida
*Nota: Asumiendo que existe una tabla intermedia de inscripción (ej. `ComisionAlumno` o similar) que vincula `Usuario` con `Comision`, ya que no se proveyó en el esquema pero es necesaria.*

```sql
SELECT 
    u."IdUsuario",
    u."Nombre",
    u."Apellido",
    u."AvatarUrl" -- Si existe columna, sino null
FROM "Usuario" u
INNER JOIN "ComisionAlumno" ca ON u."IdUsuario" = ca."IdUsuario" -- Ajustar nombre tabla intermedia
WHERE ca."IdComision" = @idComision;
```

---

## 3. Obtener Entregas Completas (Jerárquico) 🚀 *CRÍTICO*
**Endpoint:** `GetEntregasByIdActividadIdComision`
**Input:** `{ "idActividad": int, "idComision": int }`

### 📝 Descripción Funcional
Este es el endpoint más importante. Debe devolver un array de entregas. Cada entrega debe contener sus integrantes y un array de sus versiones. Cada versión debe contener, si existe, los datos de su corrección.

**Formato de Salida Esperado (JSON):**
```json
[
  {
    "idEntregaTP": 1,
    "integrantes": [1, 2],
    "versiones": [
      {
        "idVersionEntregaTP": 10,
        "fecha": "2023-10-25T10:00:00",
        "texto": "Entrega final...",
        "adjuntos": ["archivo1.pdf"],
        "fechaCorreccion": "...",    // De EntregaTPCorreccion
        "devolucion": "...",         // De EntregaTPCorreccion
        "nota": "8",                 // De EntregaTPCorreccion
        "esBorrador": false          // De EntregaTPCorreccion
      }
    ]
  }
]
```

### ⚡ Query SQL Sugerida (Uso de `json_agg` y `json_build_object`)
Esta consulta construye el JSON directamente en la base de datos, evitando el problema N+1 y procesamiento en el servidor de aplicaciones.

```sql
SELECT json_agg(
    json_build_object(
        'idEntregaTP', e."IdEntregaTP",
        'integrantes', e."Integrantes", -- Asumiendo que es un array integer[] en PG
        'versiones', (
            SELECT COALESCE(json_agg(
                json_build_object(
                    'idVersionEntregaTP', v."IdVersionEntregaTP",
                    'fecha', v."Fecha",
                    'idUsuario', v."IdUsuario",
                    'texto', v."Texto",
                    'adjuntos', v."Adjuntos",
                    -- Datos de Corrección (LEFT JOIN implícito)
                    'fechaCorreccion', c."Fecha",
                    'devolucion', c."Devolucion",
                    'adjuntosCorreccion', c."Adjuntos",
                    'anotacionesPDF', c."AnotacionesPDF",
                    'esBorrador', c."EsBorrador",
                    'esReentrega', c."EsReentrega",
                    -- Nota: Se puede tomar de NotaUsuarioActividadComision si es individual o de un campo en corrección
                    'nota', (
                        SELECT n."Nota" 
                        FROM "NotaUsuarioActividadComision" n 
                        WHERE n."IdActividad" = e."IdActividad" 
                          AND n."IdComision" = e."IdComision" 
                          AND n."IdUsuario" = ANY(e."Integrantes") 
                        LIMIT 1 -- Simplificación para nota grupal
                    )
                ) ORDER BY v."Fecha" ASC
            ), '[]'::json)
            FROM "VersionEntregaTP" v
            LEFT JOIN "EntregaTPCorreccion" c ON v."IdVersionEntregaTP" = c."IdVersionEntregaTP"
            WHERE v."IdEntregaTP" = e."IdEntregaTP"
        )
    )
) as data
FROM "EntregaTP" e
WHERE e."IdActividad" = @idActividad 
  AND e."IdComision" = @idComision;
```

---

## 4. Guardar Corrección
**Endpoint:** `SaveCorreccionTP`
**Input:** Objeto JSON con datos de corrección.

### 📝 Descripción Funcional
Debe realizar un `UPSERT` (Insertar o Actualizar) en la tabla `EntregaTPCorreccion`.
Además, si `esBorrador` es `false` (es una corrección final), debe actualizar la tabla `NotaUsuarioActividadComision` para impactar la nota oficial de los alumnos.

### ⚡ Lógica SQL (Transaccional)

**Paso 1: Upsert en `EntregaTPCorreccion`**
```sql
INSERT INTO "EntregaTPCorreccion" (
    "IdVersionEntregaTP", "IdUsuario", "Fecha", "Devolucion", 
    "Adjuntos", "AnotacionesPDF", "EsBorrador", "EsReentrega"
) VALUES (
    @idVersionEntregaTP, @idUsuarioCorrector, NOW(), @devolucion, 
    @adjuntos, @anotacionesPDF, @esBorrador, @esReentrega
)
ON CONFLICT ("IdVersionEntregaTP") DO UPDATE SET
    "Fecha" = NOW(),
    "IdUsuario" = EXCLUDED."IdUsuario",
    "Devolucion" = EXCLUDED."Devolucion",
    "Adjuntos" = EXCLUDED."Adjuntos",
    "AnotacionesPDF" = EXCLUDED."AnotacionesPDF",
    "EsBorrador" = EXCLUDED."EsBorrador",
    "EsReentrega" = EXCLUDED."EsReentrega";
```

**Paso 2: Impactar Nota (Solo si NO es borrador)**
Si `@esBorrador` es `false`, se debe buscar a los integrantes de la entrega y actualizar sus notas.

```sql
-- Obtener integrantes de la entrega asociada a la versión
WITH IntegrantesEntrega AS (
    SELECT e."Integrantes", e."IdActividad", e."IdComision"
    FROM "VersionEntregaTP" v
    JOIN "EntregaTP" e ON v."IdEntregaTP" = e."IdEntregaTP"
    WHERE v."IdVersionEntregaTP" = @idVersionEntregaTP
)
-- Insertar o actualizar nota para cada integrante
INSERT INTO "NotaUsuarioActividadComision" ("IdActividad", "IdComision", "IdUsuario", "Nota", "Observacion")
SELECT 
    ie."IdActividad", 
    ie."IdComision", 
    unnest(ie."Integrantes"), -- Desglosa el array de integrantes
    @nota, 
    'Nota de TP'
FROM IntegrantesEntrega ie
ON CONFLICT ("IdActividad", "IdComision", "IdUsuario") DO UPDATE SET
    "Nota" = EXCLUDED."Nota";
```
