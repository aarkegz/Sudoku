#include <QApplication>
#include <QDir>
#include <QFile>
#include <QVector>
#include "mainwindow.h"

#define var auto

// data about file to release
namespace data {
    QVector<QString> dirs {
        "ui",
    };

    QVector<QString> files {
        "ui/main.html", "ui/main.css", "ui/jquery-3.2.1.min.js", "ui/main.js",
    };
};

void releaseFiles() {
    var appDir = new QDir(qApp->applicationDirPath());

    for (var i : data::dirs) appDir->mkdir(i);
    for (var i : data::files) QFile::copy(":/" + i, appDir->absoluteFilePath(i));
}

void deleteFiles() {
    var appDir = new QDir(qApp->applicationDirPath());

    for (var i : data::dirs) QDir(appDir->absoluteFilePath(i)).removeRecursively();
}

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);

    releaseFiles();

    MainWindow w;
    w.show();

    var returnValue = app.exec();

    deleteFiles();

    return returnValue;
}
