#include <QApplication>
#include <QDir>
#include <QFile>
#include <QVector>
#include "mainwindow.h"

#define var auto

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);

    MainWindow w;
    w.show();

    var returnValue = app.exec();

    return returnValue;
}
