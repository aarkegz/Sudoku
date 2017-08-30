#include "sudokustatus.h"
#include <cstring>
using namespace std;

void SudokuStatus::check() {
    _fulfilled = true;
    _illegal = false;

    // find empty cells
    for (int i = 0; i < SUDOKU_SIZE; ++i)
        for (int j = 0; j < SUDOKU_SIZE; ++j)
            if (!_mat[i][j]) _fulfilled = false;

    // check rows
    for (int i = 0; i < SUDOKU_SIZE; ++i) {
        int flg = 0;

        for (int j = 0; j < SUDOKU_SIZE; ++j)
            if (flg & (1 << _mat[i][j])) { _illegal = false; return; }
            else flg |= (1 << _mat[i][j]);
    }

    // check columns
    for (int i = 0; i < SUDOKU_SIZE; ++i) {
        int flg = 0;

        for (int j = 0; j < SUDOKU_SIZE; ++j)
            if (flg & (1 << _mat[j][i])) { _illegal = false; return; }
            else flg |= (1 << _mat[j][i]);
    }

    // check blocks
    for (int i = 0; i < SUDOKU_SIZE; ++i) {
        int flg = 0;

        for (int j = 0; j < SUDOKU_SIZE; ++j)
            if (flg & (1 << _mat[((i % 3) * 3) + (j % 3)][((i / 3) * 3) + (j / 3)])) { _illegal = false; return; }
            else flg |= (1 << _mat[((i % 3) * 3) + (j % 3)][((i / 3) * 3) + (j / 3)]);
    }
}

int* SudokuStatus::operator[](const int& b) { return _mat[b]; }

SudokuStatus::SudokuStatus() {
    memset(_mat, 0, sizeof(_mat));

    check();
}

SudokuStatus::SudokuStatus(const SudokuStatus& origin) {
    memcpy(_mat, origin._mat, sizeof(_mat));

    check();
}

bool SudokuStatus::isFulfilled() const { return _fulfilled; }
bool SudokuStatus::isSuccess() const { return _fulfilled && !_illegal; }
bool SudokuStatus::isFailed() const { return _fulfilled && _illegal; }
bool SudokuStatus::isIllegal() const { return _illegal; }

const int* SudokuStatus::operator[](const int& b) const { return _mat[b]; }

SudokuStatus SudokuStatus::Expand(int x, int y, int value) {
    auto rv = *this;
    rv[x][y] = value;
    return rv;
}
