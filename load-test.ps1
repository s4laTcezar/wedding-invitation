# Load check: 10 parallel requests, response time for each.
# Run: .\load-test.ps1

$url = "https://wedding-invitation-55wh.onrender.com/"

$jobs = 1..1000 | ForEach-Object {
    Start-Job -ScriptBlock {
        param($u)
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        try {
            $r = Invoke-WebRequest -Uri $u -UseBasicParsing
            "$($r.StatusCode) - $($sw.ElapsedMilliseconds) ms"
        } catch {
            "ERROR: $($_.Exception.Message)"
        }
    } -ArgumentList $url
}

$jobs | Wait-Job | Receive-Job
$jobs | Remove-Job
