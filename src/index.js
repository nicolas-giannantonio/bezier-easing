const Ke = 4, Je = .001, ts = 1e-7, es = 10, H = 11, V = 1 / (H - 1), vt = (e, t) => 1 - 3 * t + 3 * e,
    Mt = (e, t) => 3 * t - 6 * e, Et = e => 3 * e;

function Q(e, t, s) {
    return ((vt(t, s) * e + Mt(t, s)) * e + Et(t)) * e
}

function bt(e, t, s) {
    return 3 * vt(t, s) * e * e + 2 * Mt(t, s) + Et(t)
}

function ss(e, t, s, i, r) {
    let n, h, l = 0;
    do h = t + (s - t) / 2, n = Q(h, i, r) - e, n > 0 ? s = h : t = h; while (Math.abs(n) > ts && ++l < es);
    return h
}

function is(e, t, s, i) {
    for (let r = 0; r < Ke; ++r) {
        let n = bt(t, s, i);
        if (n === 0) return t;
        let h = Q(t, s, i) - e;
        t -= h / n
    }
    return t
}

const LinearEasing = x => x;
module.exports = function bezier(mX1, mY1, mX2, mY2) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) throw new Error('bezier x values must be in [0, 1] range');
    if (mX1 === mY1 && mX2 === mY2) return LinearEasing;
    let r = new Float32Array(H);
    for (let h = 0; h < H; ++h) r[h] = Q(h * V, mX1, mX2);

    function n(h) {
        let l = 0, a = 1, c = H - 1;
        for (; a !== c && r[a] <= h; ++a) l += V;
        --a;
        let o = (h - r[a]) / (r[a + 1] - r[a]), f = l + o * V, d = bt(f, mX1, mX2);
        return d >= Je ? is(h, f, mX1, mX2) : d === 0 ? f : ss(h, l, l + V, mX1, mX2)
    }

    return function BezierEasing(x) {
        if (x === 0 || x === 1) return x;
        return Q(n(x), mY1, mY2)
    }
};
