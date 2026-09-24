/**
 * Derleme sonrası adım.
 *
 * Next, statik export sırasında kendi varsayılan 404 sayfasını out/404.html
 * olarak yazıyor ve public/ içine konan aynı adlı dosyayı eziyor. GitHub Pages
 * ise bilinmeyen yollarda tam olarak /404.html dosyasını servis ediyor.
 * Bu yüzden markalı sayfa derlemeden sonra üzerine kopyalanıyor.
 */
import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const from = resolve("tools/404.html");
const to = resolve("out/404.html");

if (!existsSync(from)) {
  console.error("postbuild: tools/404.html bulunamadı");
  process.exit(1);
}
if (!existsSync(resolve("out"))) {
  console.error("postbuild: out/ yok — önce next build çalışmalı");
  process.exit(1);
}

copyFileSync(from, to);
console.log("postbuild: markalı 404 sayfası out/404.html olarak yazıldı");
