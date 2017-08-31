using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;

namespace Pngp {
    public class MainClass {
        public static int Main() {
            var files = new DirectoryInfo(Directory.GetCurrentDirectory()).EnumerateFiles("*.png");

            foreach (var img in files) {
                var i = (Bitmap)(Image.FromFile(img.FullName));
                i.MakeTransparent(Color.White);
                i.Save(img.FullName);
            }

            return 0;
        }
    }
}