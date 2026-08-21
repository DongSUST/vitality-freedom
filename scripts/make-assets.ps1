Add-Type -AssemblyName System.Drawing
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = 'Center'
$sf.LineAlignment = 'Center'

# ---- og.png (1200x630, 1.91:1) ----
$w = 1200; $h = 630
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.TextRenderingHint = 'AntiAlias'
$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.Color]::FromArgb(255, 11, 18, 32), [System.Drawing.Color]::FromArgb(255, 4, 6, 11), 90.0)
$g.FillRectangle($brush, $rect)
$rnd = New-Object System.Random(7)
for ($i = 0; $i -lt 130; $i++) {
  $x = $rnd.Next(0, $w); $y = $rnd.Next(0, [int]($h * 0.55))
  $s = $rnd.Next(1, 3); $a = $rnd.Next(60, 200)
  $sb = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($a, 223, 230, 240))
  $g.FillEllipse($sb, $x, $y, $s, $s)
}
$pts1 = @([System.Drawing.PointF]::new(0, 430), [System.Drawing.PointF]::new(90, 360), [System.Drawing.PointF]::new(170, 410), [System.Drawing.PointF]::new(260, 330), [System.Drawing.PointF]::new(360, 400), [System.Drawing.PointF]::new(470, 345), [System.Drawing.PointF]::new(560, 415), [System.Drawing.PointF]::new(660, 340), [System.Drawing.PointF]::new(770, 405), [System.Drawing.PointF]::new(880, 355), [System.Drawing.PointF]::new(980, 420), [System.Drawing.PointF]::new(1080, 350), [System.Drawing.PointF]::new(1200, 415), [System.Drawing.PointF]::new(1200, 630), [System.Drawing.PointF]::new(0, 630))
$m1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 13, 21, 38))
$g.FillPolygon($m1, $pts1)
$pts2 = @([System.Drawing.PointF]::new(0, 495), [System.Drawing.PointF]::new(140, 448), [System.Drawing.PointF]::new(240, 478), [System.Drawing.PointF]::new(360, 432), [System.Drawing.PointF]::new(480, 472), [System.Drawing.PointF]::new(600, 442), [System.Drawing.PointF]::new(720, 478), [System.Drawing.PointF]::new(840, 442), [System.Drawing.PointF]::new(960, 472), [System.Drawing.PointF]::new(1080, 450), [System.Drawing.PointF]::new(1200, 472), [System.Drawing.PointF]::new(1200, 630), [System.Drawing.PointF]::new(0, 630))
$m2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 10, 17, 29))
$g.FillPolygon($m2, $pts2)
$rp = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 36, 80, 111), 7)
$g.DrawBezier($rp, 600, 630, 600, 590, 596, 560, 596, 522)
$g.DrawBezier($rp, 600, 572, 540, 542, 480, 502, 380, 464)
$g.DrawBezier($rp, 600, 562, 660, 532, 720, 502, 820, 464)
$gp = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(230, 236, 217, 171), 3)
$g.DrawBezier($gp, 600, 630, 600, 600, 598, 576, 597, 542)
$fPhi = New-Object System.Drawing.Font('Georgia', 150)
$bPhi = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 236, 217, 171))
$g.DrawString([char]0x03A6, $fPhi, $bPhi, (New-Object System.Drawing.RectangleF(0, 58, $w, 240)), $sf)
$fTitle = New-Object System.Drawing.Font('Georgia', 58)
$bWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 238, 240, 230))
$g.DrawString('Vitality x Freedom', $fTitle, $bWhite, (New-Object System.Drawing.RectangleF(0, 326, $w, 80)), $sf)
$fSub = New-Object System.Drawing.Font('Consolas', 23)
$bGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 201, 168, 106))
$g.DrawString('VITALITY-DRIVEN FREEDOM SYSTEM', $fSub, $bGold, (New-Object System.Drawing.RectangleF(0, 410, $w, 40)), $sf)
$fForm = New-Object System.Drawing.Font('Georgia', 32)
$bDim = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 174, 182, 194))
$g.DrawString('Φ = V × F × ηA', $fForm, $bDim, (New-Object System.Drawing.RectangleF(0, 468, $w, 48)), $sf)
$g.Dispose()
New-Item -ItemType Directory -Force -Path public | Out-Null
$bmp.Save((Join-Path $PWD 'public\og.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

# ---- apple-touch-icon.png (180x180) ----
$b2 = New-Object System.Drawing.Bitmap(180, 180)
$g2 = [System.Drawing.Graphics]::FromImage($b2)
$g2.SmoothingMode = 'AntiAlias'
$g2.TextRenderingHint = 'AntiAlias'
$g2.Clear([System.Drawing.Color]::FromArgb(255, 7, 11, 19))
$cpen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 201, 168, 106), 3)
$g2.DrawEllipse($cpen, 24, 24, 132, 132)
$fI = New-Object System.Drawing.Font('Georgia', 96)
$bI = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 236, 217, 171))
$g2.DrawString([char]0x03A6, $fI, $bI, (New-Object System.Drawing.RectangleF(0, 28, 180, 132)), $sf)
$g2.Dispose()
$b2.Save((Join-Path $PWD 'public\apple-touch-icon.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$b2.Dispose()
Write-Output 'assets written: public/og.png public/apple-touch-icon.png'
