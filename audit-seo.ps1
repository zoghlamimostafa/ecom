# === AUDIT SEO COMPLET - SANNY STORE ===
Write-Host "======================================="
Write-Host "🔍 AUDIT SEO COMPLET - SANNY STORE"
Write-Host "======================================="
Write-Host ""

# Pages principales à vérifier
$pages = @("Home.js", "About.js", "Contact.js", "OurStore.js", "Cart.js", "Login.js", "Signup.js", "Checkout.js", "SingleProduct.js", "Blogs.js", "PrivacyPolicy.js", "RefundPolicy.js", "TermAndConditions.js")

$completedPages = 0
$pendingPages = 0
$notFoundPages = 0

Write-Host "🔍 RÉSULTATS DE L'AUDIT:"
Write-Host ""

foreach ($page in $pages) {
    $filePath = ".\Client\src\pages\$page"
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        if ($content -match "SEOEnhancer") {
            Write-Host "✅ $page - SEO Parfait (SEOEnhancer)" -ForegroundColor Green
            $completedPages++
        } elseif ($content -match "Meta") {
            Write-Host "⚠️  $page - SEO Basique (Meta seulement)" -ForegroundColor Yellow
            $pendingPages++
        } else {
            Write-Host "❌ $page - Aucun SEO détecté" -ForegroundColor Red
            $pendingPages++
        }
    } else {
        Write-Host "❓ $page - Fichier non trouvé" -ForegroundColor Gray
        $notFoundPages++
    }
}

Write-Host ""
Write-Host "=== STATISTIQUES ==="
Write-Host "✅ Pages parfaites: $completedPages" -ForegroundColor Green
Write-Host "⚠️  Pages à améliorer: $pendingPages" -ForegroundColor Yellow
Write-Host "❓ Pages non trouvées: $notFoundPages" -ForegroundColor Gray

if (($completedPages + $pendingPages) -gt 0) {
    $scorePercent = [math]::Round(($completedPages * 100) / ($completedPages + $pendingPages))
    Write-Host "📊 Score SEO: $scorePercent%" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "=== RECOMMANDATIONS ==="
Write-Host "1. Ajouter SEOEnhancer aux pages avec Meta seulement"
Write-Host "2. Créer les clés de traduction SEO manquantes"
Write-Host "3. Optimiser les meta descriptions et mots-clés"
Write-Host "4. Vérifier les images alt tags"
Write-Host "5. Tester les Core Web Vitals"
Write-Host "6. Implémenter Schema.org markup"