#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent), ui(new Ui::MainWindow) {
    ui->setupUi(this);

    appDir = new QDir(qApp->applicationDirPath());

    this->setFixedSize(this->size());

    QWebEngineView *view = new QWebEngineView(this);
    view->setGeometry(0, 0, this->width(), this->height());

    view->load(QUrl(appDir->absoluteFilePath("ui/main.html")));
    view->show();
}

MainWindow::~MainWindow() { delete ui; }
