#ifndef CONN_H
#define CONN_H

#include <QObject>

class Conn : public QObject {
    Q_OBJECT
public:
    explicit Conn(QObject *parent = nullptr);

signals:
    void sendPuzzle(QString puzzle);

public slots:
    void requestPuzzle(int level);
};

#endif  // CONN_H
