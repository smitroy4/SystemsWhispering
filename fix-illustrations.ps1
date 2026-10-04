$contentDir = "H:\Projects\React Projects\s4j-dsa\src\content"
$categories = @("dataStructures", "algorithms", "concepts")

foreach ($cat in $categories) {
    $catDir = Join-Path $contentDir $cat
    $files = Get-ChildItem -Path $catDir -Filter "*.ts" -File
    foreach ($file in $files) {
        $content = Get-Content -Path $file.FullName -Raw
        if ($content -match 'illustrations') { continue }
        $newContent = $content -replace "problemIds: .+?(\r?\n\s*})", "problemIds$1 illustrations: string[]`n                          javaBuiltIn?: string[];`n                          related?: string[];"
        if (-not $newContent) {
            $newContent = $content -replace "vizId: .+?(\r?\n\s*})", "vizId$1 illustrations: string[]`n                          javaBuiltIn?: string[];`n                          related?: string[];"
        }
        if ($newContent -and $newContent -ne $content) {
            Set-Content -Path $file.FullName -NoNewline -Value $newContent
            Write-Host "Updated: $($file.Name)"
        }
    }
}
Write-Host "Done!"