param(
  [string]$Serial = ""
)

$ErrorActionPreference = "Stop"

Push-Location $PSScriptRoot

npm run build
npx cap sync android

$androidDir = Join-Path $PSScriptRoot 'android'
Push-Location $androidDir

if ($Serial -ne "") {
  .\gradlew assembleDebug
  $apk = Join-Path (Get-Location) 'app\build\outputs\apk\debug\app-debug.apk'
  try { adb -s $Serial uninstall com.dualite.listacompras } catch {}
  adb -s $Serial install -r $apk
  adb -s $Serial shell am start -n com.dualite.listacompras/.MainActivity
} else {
  .\gradlew installDebug
  adb shell am start -n com.dualite.listacompras/.MainActivity
}

Pop-Location
Pop-Location