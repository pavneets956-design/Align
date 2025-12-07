# Install TalkingLight APK on connected Android device
$apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"

if (Test-Path $apkPath) {
    Write-Host "Installing APK..." -ForegroundColor Green
    adb install -r $apkPath
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ App installed successfully!" -ForegroundColor Green
        Write-Host "Open TalkingLight on your device to test." -ForegroundColor Cyan
    } else {
        Write-Host "❌ Installation failed. Check device connection." -ForegroundColor Red
    }
} else {
    Write-Host "❌ APK not found at: $apkPath" -ForegroundColor Red
    Write-Host "Build the APK first in Android Studio:" -ForegroundColor Yellow
    Write-Host "  Build → Build Bundle(s) / APK(s) → Build APK(s)" -ForegroundColor Yellow
}

