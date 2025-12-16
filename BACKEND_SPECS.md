# Especificaciones de Backend (API & SQL)

Este documento detalla los endpoints necesarios para `NuevoTPCorreccionAjax.php` y la lógica SQL requerida para interactuar con el esquema de base de datos provisto.

## 🔒 Seguridad y Permisos
Todas las funciones deben verificar primero si el usuario logueado (`ServiceSecurity::GetCurrrentUser()`) tiene permiso sobre la `Comision` y `Actividad` en cuestión.
- Verificar existencia en `MateriaCursoDocente` o rol de Admin/Directivo.

---

## 1. Endpoint: `GetTPContext`
**Descripción:** Obtiene toda la información estática necesaria para inicializar la interfaz de corrección.
**Input (JSON en `$_POST['data']`):**
```json
{ "idActividad": 123, "idComision": 456 }
```

### Lógica SQL / Servicios
Se requieren 3 conjuntos de datos en la respuesta:

#### A. Configuración y Actividad
```sql
SELECT 
    ac."IdActividad",
    ac."IdComision",
    ac."FechaInicio",
    ac."FechaVencimiento",
    ac."EsGrupal",
    ac."MaxEstudiantesPorGrupo",
    ac."IdEscala",
    tpc."Consigna",
    tpc."ConsignaAdjuntos",
    tpc."RequiereAdjuntos"
FROM "ActividadComision" ac
LEFT JOIN "TPConfiguracion" tpc ON ac."IdActividad" = tpc."IdActividad"
WHERE ac."IdActividad" = :idActividad AND ac."IdComision" = :idComision;
```

#### B. Escala de Notas
```sql
SELECT e."IdEscala", e."Nombre", e."Items"
FROM "Escala" e
WHERE e."IdEscala" = (SELECT "IdEscala" FROM "ActividadComision" WHERE "IdActividad" = :idActividad AND "IdComision" = :idComision);
```

#### C. Alumnos de la Comisión
Obtener lista de usuarios alumnos inscritos en la comisión.
```sql
SELECT u."IdUsuario", u."Nombre", u."Apellido", u."UrlFoto"
FROM "Usuario" u
JOIN "UsuarioJerarquia" uj ON u."IdUsuario" = uj."IdUsuario"
JOIN "Comision" c ON c."IdJerarquia" = uj."IdJerarquia"
WHERE c."IdComision" = :idComision
AND uj."Activo" = true; -- Asumiendo flag de activo
```

**Output Esperado (JSON):**
```json
{
    "success": true,
    "data": {
        "tpConfiguracion": { ... },
        "escala": { ... },
        "alumnos": [ ... ]
    }
}
```

---

## 2. Endpoint: `ListEntregas`
**Descripción:** El endpoint más crítico. Debe devolver la estructura jerárquica de entregas -> versiones -> correcciones.
**Input:** `{ "idActividad": 123, "idComision": 456 }`

### Lógica SQL
Se recomienda una query principal para traer las entregas y luego iterar o usar `json_agg` si la versión de PostgreSQL lo permite (9.4+).

#### Query Principal (Entregas + Versiones + Correcciones)
```sql
SELECT 
    et."IdEntregaTP",
    et."Integrantes", -- Array de IDs de usuarios
    vet."IdVersionEntregaTP",
    vet."Fecha" as "FechaEntrega",
    vet."Texto" as "TextoEntrega",
    vet."Adjuntos" as "AdjuntosEntrega",
    vet."IdUsuario" as "IdUsuarioEntrega",
    -- Datos de Corrección (LEFT JOIN porque puede no haber corrección)
    etc."Devolucion",
    etc."Fecha" as "FechaCorreccion",
    etc."Adjuntos" as "AdjuntosCorreccion",
    etc."AnotacionesPDF",
    etc."EsBorrador",
    etc."EsReentrega",
    -- Nota Final (si existe)
    nuac."Nota" as "NotaFinal"
FROM "EntregaTP" et
JOIN "VersionEntregaTP" vet ON et."IdEntregaTP" = vet."IdEntregaTP"
LEFT JOIN "EntregaTPCorreccion" etc ON vet."IdVersionEntregaTP" = etc."IdVersionEntregaTP"
LEFT JOIN "NotaUsuarioActividadComision" nuac 
    ON nuac."IdActividad" = et."IdActividad" 
    AND nuac."IdComision" = et."IdComision" 
    AND nuac."IdUsuario" = ANY(et."Integrantes") -- Simplificación: la nota suele ser individual, pero en TP grupal se replica
WHERE et."IdActividad" = :idActividad AND et."IdComision" = :idComision
ORDER BY et."IdEntregaTP", vet."Fecha" ASC;
```

**Procesamiento en PHP:**
Agrupar los resultados por `IdEntregaTP`. Construir un array donde cada entrega tenga un array de `versiones`.

**Output Esperado (JSON):**
```json
[
    {
        "idEntrega": 1,
        "integrantes": [101, 102],
        "versiones": [
            {
                "idVersion": 55,
                "fecha": "2023-10-01...",
                "correccion": {
                    "feedback": "Muy bien",
                    "nota": 8,
                    "esBorrador": false
                }
            }
        ]
    }
]
```

---

## 3. Endpoint: `SaveCorreccion`
**Descripción:** Guarda o actualiza la corrección de una versión específica.
**Input:**
```json
{
    "idVersionEntregaTP": 55,
    "devolucion": "Excelente trabajo...",
    "nota": 9,
    "esBorrador": false,
    "esReentrega": false,
    "anotacionesPDF": "{...}"
}
```

### Lógica SQL / Transacción

1. **Upsert en `EntregaTPCorreccion`:**
   Verificar si ya existe registro para `IdVersionEntregaTP`.
   ```sql
   -- Si existe UPDATE, sino INSERT
   INSERT INTO "EntregaTPCorreccion" 
   ("IdVersionEntregaTP", "IdUsuario", "Fecha", "Devolucion", "AnotacionesPDF", "EsBorrador", "EsReentrega")
   VALUES (:idVersion, :idDocente, NOW(), :devolucion, :anotaciones, :esBorrador, :esReentrega)
   ON CONFLICT ("IdVersionEntregaTP") DO UPDATE SET
   "Devolucion" = EXCLUDED."Devolucion",
   "Fecha" = NOW(),
   "EsBorrador" = EXCLUDED."EsBorrador",
   ...;
   ```

2. **Actualizar Nota Oficial (Si no es borrador):**
   Si `EsBorrador` es `false`, se debe impactar la nota en la tabla de notas oficial para **todos los integrantes** de la entrega.
   
   *Paso 2.1: Obtener integrantes*
   ```sql
   SELECT "Integrantes" FROM "EntregaTP" 
   WHERE "IdEntregaTP" = (SELECT "IdEntregaTP" FROM "VersionEntregaTP" WHERE "IdVersionEntregaTP" = :idVersion);
   ```
   
   *Paso 2.2: Insertar/Actualizar Nota*
   ```sql
   -- Iterar por cada IdUsuario integrante
   INSERT INTO "NotaUsuarioActividadComision" ("IdActividad", "IdComision", "IdUsuario", "Nota", "Observacion")
   VALUES (:idActividad, :idComision, :idUsuario, :nota, 'Nota de TP')
   ON CONFLICT ("IdActividad", "IdComision", "IdUsuario") DO UPDATE SET
   "Nota" = EXCLUDED."Nota";
   ```

---

## 4. Endpoint: `UpdateIntegrantes`
**Descripción:** Modifica los integrantes de una entrega grupal.
**Input:** `{ "idEntregaTP": 1, "integrantes": [101, 102, 103] }`

### Lógica SQL
```sql
UPDATE "EntregaTP"
SET "Integrantes" = :arrayIntegrantes
WHERE "IdEntregaTP" = :idEntregaTP;
```
*Nota: Validar que los nuevos integrantes no pertenezcan ya a otra entrega en la misma actividad.*

---

## 5. Endpoint: `UploadAdjuntos`
**Descripción:** Recibe archivos binarios y los asocia a la corrección.
**Input:** `FormData` con archivos y `idVersionEntregaTP`.

### Lógica
1. Guardar archivos en disco/storage.
2. Actualizar array de paths en BD:
```sql
UPDATE "EntregaTPCorreccion"
SET "Adjuntos" = array_append("Adjuntos", :nuevoPath)
WHERE "IdVersionEntregaTP" = :idVersion;
```
