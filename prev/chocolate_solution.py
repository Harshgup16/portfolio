def multiply(A, B):
    res = [[0]*3 for _ in range(3)]
    for i in range(3):
        for j in range(3):
            for k in range(3):
                res[i][j] = (res[i][j] + A[i][k] * B[k][j]) % MOD
    return res

def power(M, n):
    result = [[1,0,0],[0,1,0],[0,0,1]]
    while n:
        if n % 2:
            result = multiply(result, M)
        M = multiply(M, M)
        n //= 2
    return result

def count_ways(n):
    if n == 0: return 1
    if n == 1: return 1
    if n == 2: return 2

    M = [
        [1, 1, 2],
        [1, 0, 0],
        [0, 1, 0]
    ]

    # base vector [f(2), f(1), f(0)]
    base = [2, 1, 1]

    M_power = power(M, n - 2)

    ans = (
        M_power[0][0] * base[0] +
        M_power[0][1] * base[1] +
        M_power[0][2] * base[2]
    )

    return ans

n = int(input())
print(count_ways(n))