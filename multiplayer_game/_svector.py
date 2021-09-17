import math

class SVector:
    ''' A simple vector class '''
    x: int
    y: int

    def __init__(self, x: int = 0, y: int = 0):
        self.x = x
        self.y = y
    
    def __add__(self, v):
        return self.__class__(self.x + v.x, y + self.v.y)
            
    def __sub__(self, v):
        return self.__class__(self.x - v.x, y - self.v.y)
    
    def __mul__(self, a: float):
        return self.__class__(self.x * a, self.y * a)
    
    def __truediv__(self, a: float):
        return self.__class__(self.x / a, self.y / a)
    
    def dist(self, v) -> float:
        displacement = self - v
        return math.sqrt(displacement.x ** 2 + displacement.y ** 2)

    def distsq(self, v) -> float:
        displacement = self - v
        return displacement.x ** 2 + displacement.y ** 2