param(
    [int]$IntervalSeconds = 300,
    [switch]$Once
)

$ErrorActionPreference = 'Stop'

function Sync-Changes {
    $branch = (git branch --show-current).Trim()
    if ([string]::IsNullOrWhiteSpace($branch)) {
        throw 'The repository is in a detached HEAD state; cannot determine a branch to push.'
    }

    $status = git status --porcelain --untracked-files=all
    if ($LASTEXITCODE -ne 0) {
        throw 'Unable to read the Git worktree status.'
    }

    if ([string]::IsNullOrWhiteSpace(($status -join "`n"))) {
        Write-Host "No changes to push on '$branch'."
        return
    }

    git add --all
    if ($LASTEXITCODE -ne 0) {
        throw 'Git could not stage the worktree changes.'
    }

    git commit -m "Auto-update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    if ($LASTEXITCODE -ne 0) {
        throw 'Git could not create the auto-commit.'
    }

    git push origin $branch
    if ($LASTEXITCODE -ne 0) {
        throw "Git could not push branch '$branch' to origin."
    }
}

do {
    try {
        Sync-Changes
    }
    catch {
        Write-Host "Auto-push failed: $($_.Exception.Message)"
        if (-not $Once) {
            Write-Host "Retrying in $IntervalSeconds seconds."
        }
    }

    if (-not $Once) {
        Start-Sleep -Seconds $IntervalSeconds
    }
} while (-not $Once)