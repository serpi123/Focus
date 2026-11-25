; =========================================
; DESINSTALACIÓN SEGURA
; =========================================
; Por defecto, electron-builder borra la carpeta de instalación entera (RMDir /r $INSTDIR).
; Si alguien instala FOCUS en una carpeta que ya tenía otros archivos (por ejemplo, una
; carpeta llamada "focus"), desinstalar o actualizar borraría también esos archivos.
; Esta macro borra SOLO los archivos que instala FOCUS y después la carpeta, si quedó vacía.

!macro customRemoveFiles
  ; Salir de $INSTDIR para poder borrarla al final
  SetOutPath $TEMP

  Delete "$INSTDIR\FOCUS.exe"
  Delete "$INSTDIR\Uninstall FOCUS.exe"
  Delete "$INSTDIR\uninstallerIcon.ico"
  Delete "$INSTDIR\LICENSE.electron.txt"
  Delete "$INSTDIR\LICENSES.chromium.html"
  Delete "$INSTDIR\chrome_100_percent.pak"
  Delete "$INSTDIR\chrome_200_percent.pak"
  Delete "$INSTDIR\resources.pak"
  Delete "$INSTDIR\d3dcompiler_47.dll"
  Delete "$INSTDIR\dxcompiler.dll"
  Delete "$INSTDIR\dxil.dll"
  Delete "$INSTDIR\electron_wer.dll"
  Delete "$INSTDIR\ffmpeg.dll"
  Delete "$INSTDIR\libEGL.dll"
  Delete "$INSTDIR\libGLESv2.dll"
  Delete "$INSTDIR\vk_swiftshader.dll"
  Delete "$INSTDIR\vk_swiftshader_icd.json"
  Delete "$INSTDIR\vulkan-1.dll"
  Delete "$INSTDIR\icudtl.dat"
  Delete "$INSTDIR\snapshot_blob.bin"
  Delete "$INSTDIR\v8_context_snapshot.bin"

  ; Estas dos carpetas las crea FOCUS: se pueden borrar completas
  RMDir /r "$INSTDIR\locales"
  RMDir /r "$INSTDIR\resources"

  ; Sin /r: solo se borra si quedó vacía (si había otros archivos, se conservan)
  RMDir "$INSTDIR"
!macroend
