#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QDir>
#include <QMainWindow>
#include <QWebEngineView>

namespace Ui {
    class MainWindow;
}

class MainWindow : public QMainWindow {
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();

private:
    Ui::MainWindow *ui;

    QDir *appDir;
};

#endif  // MAINWINDOW_H
