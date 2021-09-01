
export function gcd(...nums: number[]): number {
    debugger;
    const _gcd = (x: number, y: number): number => {
        return !y ? x : gcd(y, x % y);
    }
    return [...nums].reduce((acc, item) => {
        return _gcd(acc, item)
    });
}
