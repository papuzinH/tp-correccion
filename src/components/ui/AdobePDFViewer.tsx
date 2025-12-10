import React, { useEffect, useRef } from 'react';

interface AdobeEvent {
  type: string;
  data: unknown;
}

interface AdobeAnnotationManager {
  addAnnotations: (annotations: unknown[]) => Promise<void>;
  getAnnotations: () => Promise<unknown[]>;
  registerEventListener: (callback: (event: AdobeEvent) => void, options?: unknown) => void;
}

interface AdobeViewer {
  getAnnotationManager: () => Promise<AdobeAnnotationManager>;
}

interface AdobeDCView {
  registerCallback: (type: unknown, callback: () => Promise<unknown>, options: unknown) => void;
  previewFile: (content: unknown, options: unknown) => Promise<AdobeViewer>;
}

interface AdobeDC {
  View: {
    new (options: { clientId: string; divId: string }): AdobeDCView;
    Enum: {
      CallbackType: {
        GET_USER_PROFILE_API: string;
      };
      ApiResponseCode: {
        SUCCESS: string;
      };
    };
  };
}

declare global {
  interface Window {
    AdobeDC: AdobeDC;
  }
}

interface AdobePDFViewerProps {
  url: string;
  fileName: string;
  initialAnnotations?: string | null;
  onAnnotationsChange?: (annotations: string) => void;
  clientId: string;
}

export const AdobePDFViewer: React.FC<AdobePDFViewerProps> = ({
  url,
  fileName,
  initialAnnotations,
  onAnnotationsChange,
  clientId
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    // Evitar reinicializaciones innecesarias si las props no críticas cambian
    // Pero si cambia la URL, queremos recargar.
    
    const initViewer = () => {
      if (!divRef.current || !window.AdobeDC) return;

      // Generar un ID único para el div si no tiene uno o para asegurar unicidad
      const divId = 'adobe-pdf-viewer-' + Math.random().toString(36).substr(2, 9);
      divRef.current.id = divId;

      const adobeDCView = new window.AdobeDC.View({
        clientId: clientId,
        divId: divId,
      });

      // Configuración de perfil de usuario
      adobeDCView.registerCallback(
        window.AdobeDC.View.Enum.CallbackType.GET_USER_PROFILE_API,
        () => {
          return new Promise((resolve) => {
            resolve({
              code: window.AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
              data: {
                userProfile: {
                  name: "Docente", 
                }
              }
            });
          });
        }, {}
      );

      const previewFilePromise = adobeDCView.previewFile({
        content: { location: { url: url } },
        metaData: { fileName: fileName, id: fileName }
      }, {
        embedMode: "FULL_WINDOW",
        showAnnotationTools: true,
        enableAnnotationAPIs: true,
        includePDFAnnotations: true
      });

      previewFilePromise.then((adobeViewer: AdobeViewer) => {
        adobeViewer.getAnnotationManager().then((annotationManager: AdobeAnnotationManager) => {
          // Cargar anotaciones iniciales si existen y no se han cargado ya
          if (initialAnnotations && !isLoadedRef.current) {
            try {
              const annotations = JSON.parse(initialAnnotations);
              annotationManager.addAnnotations(annotations)
                .then(() => {
                   console.log("Anotaciones iniciales cargadas");
                })
                .catch((e: unknown) => console.error("Error cargando anotaciones", e));
            } catch (e) {
              console.error("Error parsing initial annotations", e);
            }
          }
          isLoadedRef.current = true;

          // Escuchar cambios
          const saveAnnotations = () => {
             annotationManager.getAnnotations().then((result: unknown[]) => {
                const annotationsJSON = JSON.stringify(result);
                if (onAnnotationsChange) {
                    onAnnotationsChange(annotationsJSON);
                }
             });
          };

          annotationManager.registerEventListener(
            (event: AdobeEvent) => {
              if (
                event.type === "ANNOTATION_ADDED" || 
                event.type === "ANNOTATION_UPDATED" || 
                event.type === "ANNOTATION_DELETED"
              ) {
                saveAnnotations();
              }
            },
            {
                listenOn: [
                    "ANNOTATION_ADDED", "ANNOTATION_UPDATED", "ANNOTATION_DELETED"
                ]
            }
          );
        });
      });
    };

    const loadAdobeSDK = () => {
      if (window.AdobeDC) {
        initViewer();
        return;
      }

      // Escuchar el evento ready
      document.addEventListener("adobe_dc_view_sdk.ready", () => {
        initViewer();
      });

      // Verificar si el script ya existe para no cargarlo dos veces
      if (!document.querySelector('script[src="https://documentcloud.adobe.com/view-sdk/viewer.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://documentcloud.adobe.com/view-sdk/viewer.js';
        script.async = true;
        document.body.appendChild(script);
      }
    };

    loadAdobeSDK();

    // Cleanup function
    return () => {
        // Adobe SDK no provee un método de destrucción limpio fácil de usar en React useEffect cleanup
        // pero al desmontar el componente, el div se elimina.
        isLoadedRef.current = false;
    };
  }, [url, fileName, clientId]); 

  return <div ref={divRef} style={{ width: '100%', height: '100%' }} />;
};
