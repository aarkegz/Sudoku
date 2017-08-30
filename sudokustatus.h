#ifndef SUDOKUSTATUS_H
#define SUDOKUSTATUS_H

const int SUDOKU_SIZE = 9;

class SudokuStatus {
private:
    bool _fulfilled, _illegal;
    int _mat[SUDOKU_SIZE][SUDOKU_SIZE];

    void check();

    int* operator[](const int&);

public:
    SudokuStatus();
    SudokuStatus(const SudokuStatus&);

    bool isFulfilled() const;
    bool isSuccess() const;
    bool isFailed() const;
    bool isIllegal() const;

    const int* operator[](const int&) const;

    SudokuStatus Expand(int x, int y, int value);
};

#endif  // SUDOKUSTATUS_H
