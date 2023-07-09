class Coordinate: 
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Coordinate(x={self.x}, y={self.y})"

    def __str__(self):
        return f"({self.x}, {self.y})"

    def __add__(self, other):
        if isinstance(other, Coordinate):
            return Coordinate(self.x + other.x, self.y + other.y)
        else:
            raise TypeError("Can only add two coordinates together.")

    def __sub__(self, other):
        if isinstance(other, Coordinate):
            return Coordinate(self.x - other.x, self.y - other.y)
        else:
            raise TypeError("Can only subtract two coordinates together.")

    def __mul__(self, other):
        if isinstance(other, int) or isinstance(other, float):
            return Coordinate(self.x * other, self.y * other)
        else:
            raise TypeError("Can only multiply a coordinate by an int or float.")

    def __rmul__(self, other):
        return self.__mul__(other)

    def __truediv__(self, other):
        if isinstance(other, int) or isinstance(other, float):
            return Coordinate(self.x / other, self.y / other)
        else:
            raise TypeError("Can only divide a coordinate by an int or float.")

    def __floordiv__(self, other):
        if isinstance(other, int) or isinstance(other, float):
            return Coordinate(self.x // other, self.y // other)
        else:
            raise TypeError("Can only divide a coordinate by an int or float.")

    def __eq__(self, other):
        if isinstance(other, Coordinate):
            return self.x == other.x and self.y == other.y
        else:
            raise TypeError("Can only compare two coordinates.")

    def __ne__(self, other):
        if isinstance(other, Coordinate):
            return self.x != other.x or self.y != other.y
        else:
            raise TypeError("Can only compare two coordinates.")

    def __lt__(self, other):
        if isinstance(other, Coordinate):
            return self.x < other.x and self.y < other.y
        else:
            raise TypeError("Can only compare two coordinates.")

    def __gt__(self, other):
        if isinstance(other, Coordinate):
            return self.x > other.x and self.y > other.y
        else:
            raise TypeError("Can only compare two coordinates.")