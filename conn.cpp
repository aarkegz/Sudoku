#include "conn.h"
#include <QDateTime>
#include <random>

Conn::Conn(QObject *parent) : QObject(parent) {
}

const int defaultBoard[9][9] = {
    {1, 2, 3, 4, 5, 6, 7, 8, 9},
    {4, 5, 6, 7, 8, 9, 1, 2, 3},
    {7, 8, 9, 1, 2, 3, 4, 5, 6},
    {2, 3, 4, 5, 6, 7, 8, 9, 1},
    {5, 6, 7, 8, 9, 1, 2, 3, 4},
    {8, 9, 1, 2, 3, 4, 5, 6, 7},
    {3, 4, 5, 6, 7, 8, 9, 1, 2},
    {6, 7, 8, 9, 1, 2, 3, 4, 5},
    {9, 1, 2, 3, 4, 5, 6, 7, 8},
};

const int blanksByLevel[11] = {
    4, 10, 16, 22, 28, 34, 40, 46, 52, 58, 64,
};

const int shuffleTimes = 20000;

void Conn::requestPuzzle(int level) {
    std::mt19937 ran(QDateTime::currentMSecsSinceEpoch());

    QString rv = "";

    int board[9][9];
    bool fixed[9][9];

    for (int i = 0; i < 9; ++i)
        for (int j = 0; j < 9; ++j) {
            fixed[i][j] = true;
            board[i][j] = defaultBoard[i][j];
        }

    // shuffle
    for (int _ = 0; _ < shuffleTimes; ++_) {
        switch (ran() % 3) {
            int a, b, c;
        case 0:  // exchange numbers
            a = ran() % 9;
            b = (a + ran() % 8) % 9;
            ++a;
            ++b;

            for (int i = 0; i < 9; ++i)
                for (int j = 0; j < 9; ++j)
                    if (board[i][j] == a)
                        board[i][j] = b;
                    else if (board[i][j] == b)
                        board[i][j] = a;

            break;

        case 1: // exchange rows
            a = ran() % 3;
            b = (a + ran() % 2) % 3;
            c = ran() % 3;
            a += c * 3; b += c * 3;

            for (int i = 0; i < 9; ++i)
                for (int j = 0; j < 9; ++j) std::swap(board[a][i], board[b][i]);

            break;

        case 2: // exchange columns
            a = ran() % 3;
            b = (a + ran() % 2) % 3;
            c = ran() % 3;
            a += c * 3; b += c * 3;

            for (int i = 0; i < 9; ++i)
                for (int j = 0; j < 9; ++j) std::swap(board[i][a], board[i][b]);

            break;
        }
    }

    // dig♂
    for (int i = 0; i < blanksByLevel[level]; ++i) {
        int x, y;
        do {
            x = ran() % 9; y = ran() % 9;
        } while (!fixed[x][y]);

        fixed[x][y] = false;
    }

    rv += "{ \"board\": [\n";
    for (int i = 0; i < 9; ++i) {
        rv += "[";

        for (int j = 0; j < 9; ++j) rv += QString::number(board[i][j]) + ((j < 8) ? "," : "]");
        rv += (i < 8) ? ",\n" : "],\n";
    }

    rv += "\"fixed\":[\n";
    for (int i = 0; i < 9; ++i) {
        rv += "[";

        for (int j = 0; j < 9; ++j) rv += QString(fixed[i][j] ? "true" : "false") + ((j < 8) ? "," : "]");
        rv += (i < 8) ? ",\n" : "]}\n";
    }

    emit sendPuzzle(rv);
}
