# PowerShell Script to Extract Images from HAR
$harPath = "c:\Users\lucas\OneDrive\Área de Trabalho\Sistemas\SImuladores para Aula\CoverTeste\download-manual\d39c9drjvlsyvf.cloudfront.net.har"
$outputDir = "c:\Users\lucas\OneDrive\Área de Trabalho\Sistemas\SImuladores para Aula\CoverTeste\images"

# Create output directory if it doesn't exist
if (!(Test-Path -Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

try {
    Write-Host "Reading HAR file from: $harPath"
    # Read HAR file content
    $jsonContent = Get-Content -Path $harPath -Raw -Encoding UTF8
    $harContent = $jsonContent | ConvertFrom-Json

    # Loop through entries
    $count = 0
    foreach ($entry in $harContent.log.entries) {
        $mimeType = $entry.response.content.mimeType
        $url = $entry.request.url

        # Check if it's an image
        if ($mimeType -like "image/*" -or $url -match "\.(png|jpg|gif)$") {
            
            # Extract filename from URL
            $filename = Split-Path $url -Leaf
            # Remove query parameters if any
            $filename = $filename.Split('?')[0]

            # Decode base64 content
            if ($entry.response.content.text) {
                # Check encoding or just try if it looks like base64
                $text = $entry.response.content.text
                if ($entry.response.content.encoding -eq "base64") {
                    try {
                        $bytes = [System.Convert]::FromBase64String($text)
                        $outputPath = Join-Path $outputDir $filename
                        [System.IO.File]::WriteAllBytes($outputPath, $bytes)
                        Write-Host "Restored: $filename"
                        $count++
                    }
                    catch {
                        Write-Host "Failed to decode base64 for $filename"
                    }
                }
                else {
                    # Sometimes text is just text (SVG)
                    if ($mimeType -like "*svg*") {
                        $outputPath = Join-Path $outputDir $filename
                        $text | Set-Content -Path $outputPath
                        Write-Host "Restored SVG: $filename"
                        $count++
                    }
                }
            }
        }
    }
    Write-Host "Extraction complete. Restored $count images."
}
catch {
    Write-Error "Error parsing HAR or extracting images: $_"
}
