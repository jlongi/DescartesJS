/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Get the embedded image of the license used in Arquimedes
   * @return {Image} return the image of the license used in Arquimedes
   */
  descartesJS.getCCLImg = function() {
    var img = new Image();
    img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAAfCAMAAABUFvrSAAABC1BMVEUAAAC1urSEhYRDREMNDg2EhoR5fHkpKSmRk5EbGxuRlJGVmZQoKShAQEBwcHCTmJNQUVAQEBBgYGCAgIC/v78ODg5QUFDf39/////v7++fn5+Rj49aV1jj4+PIx8cwMDB9f3zW1dUyMTGamJkZGRkNDA12c3SjoaEjHyC6ubkpKikoJSY/OzxoZWaHhoesq6s/NzljX2HPz891cnN4dXbx8fGflpqOh4uenZ0xLS4kJCQoKCjo5+ePj4+1tbUtLS3g3+Cvr6/JyMggICAqKip+e3wfGxyEgYIqJyeYlpd/gX5ubGyMiovLyst6fXmeoJ18f3xdXl2ChYJwcm81NjWWmZYyMzE+Pz6JjIk4KLQtAAACdUlEQVR4AdWVBXvbOhiFj8OcGBp/YU5UZrq0cse83f3/X7IvkS0rKnd8ym/8vFWOCD8u1g/JTxHH4glwEvGkZSSVBiedegCJxJksVLI5XZsvAMVSqQgUypKU7yZKXAFgO67nuY4NoKKJF1D1ieNXsVC+LwEQem23RjJ1VheUNw2HGTB9QeLCjDSaBmm12y1FAATejk8qtU405i6qvVBMVXCHKfQH7B2Oxi1F+JmJ4CxKEooz7A2Hq8xBz0vwI+4jPX0Ly2JlFe4a1hXxqS02NsdCNCQJxFnYWzSXmo2sFKNIHAdwiFPElGzvCCHGrV5EaHdP7BMdiENJpDgGuGSkDiSluEQccIhTgiTtMYBxLyK7f4m/uWYh/mESiuOwuQivWiy68se/RGQjfouYHeNDIZqLivz3xJuJjzRxAg4LMU3xGJzp3w4S11chye4B9QRnJSSLkxOidSH0KgAeYgenvnda76DjH5/WZ13MxGdy8gBt8pg0xeEhxuvnFyE5EOLy8ql4pk8e4BEFPau6vUD8HFUylxuT1uVw1NjVyaXgvNiV5E4xZynaICV9g7xsGuTV+npPErOK2tapy1VMf8gqvnFLy8kLZk1NXgmJaFOj45Q60ZFjFe4iUlyBTWq5HRdnP+gUcSvM60cemxnu4toN8g1RW9q/Zkt/u/jNdYdQ5lvFeGtZ79isHUO+PDbf4xvzYf6gr7k28NGy3uKb052O2byaPiGM3B+QXxz1B3PjIbpqfqNfphndCwo+KSLyb+NfhcBow8qE13/Omu8hPDY1EnxoCY8TGPlszeV/aDGLkITMARpA5f8vofWLrr1+xEpuzgPhj81XdrZiwA3vh8AAAAAASUVORK5CYII=";

    return img;
  }

  return descartesJS;
})(descartesJS || {});
