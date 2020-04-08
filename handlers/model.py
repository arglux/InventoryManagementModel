import numpy as np
import scipy.stats as stats
import scipy.optimize as optimize

# Continuity corrected normal demand
class NormalDemand:
    def __init__(self, mean, stdev):
        self.mean = mean
        self.pdf = lambda x: stats.norm.cdf(np.round(x)+0.5, mean, stdev) - stats.norm.cdf(np.round(x)-0.5, mean, stdev)
        self.cdf = lambda x: stats.norm.cdf(np.round(x)+0.5, mean, stdev)
        self.ppf = lambda x: stats.norm.ppf(x, mean, stdev)

class Cost:
    def __init__(self, A, h, b, k):
        self.A = A
        self.h = h
        self.b = b
        self.k = k

def infsum(f, a, threshold=1e-10, mincount=10):
    diff = np.inf
    integrand = np.float64(0)
    i = np.int64(a)
    count = 0
    while np.any(diff > threshold) or count < mincount:
        diff = f(i)
        i += 1
        count += 1
        integrand += diff
    return integrand
        
class QRModel:
    def __init__(self, demand, costs):
        self.demand = demand
        self.costs = costs
        self.Q = 0
        self.r = 0

    def approx_optimize_backorder(self):
        self.Q = np.sqrt((2 * self.costs.A * self.demand.mean)/self.costs.h)
        critical_fractile = self.costs.b/(self.costs.b + self.costs.h)
        self.r = self.demand.ppf(critical_fractile)
        return self.Q, self.r, self.expected_cost_backorder()

    def approx_optimize_stockout(self):
        self.Q = np.sqrt((2 * self.costs.A * self.demand.mean)/self.costs.h)
        critical_fractile = (self.costs.k * self.demand.mean)/(self.costs.h * self.Q + self.costs.k * self.demand.mean)
        self.r = self.demand.ppf(critical_fractile)
        return self.Q, self.r, self.expected_cost_stockout()

    def numeric_optimize_backorder(self):
        Q, r, _ = self.approx_optimize_backorder()
        res = optimize.minimize(lambda x: self.expected_cost_backorder(x[0], x[1]), x0=np.array([Q, r]), bounds=((Q/2, 2*Q), (r/2, 2*r)))
        self.Q, self.r = res.x
        return self.Q, self.r, self.expected_cost_backorder()

    def numeric_optimize_stockout(self):
        Q, r, _ = self.approx_optimize_stockout()
        res = optimize.minimize(lambda x: self.expected_cost_stockout(x[0], x[1]), x0=np.array([Q, r]), bounds=((Q/2, 2*Q), (r/2, 2*r)))
        self.Q, self.r = res.x
        return self.Q, self.r, self.expected_cost_stockout()

    def backorder(self, x):
        return infsum(lambda y: (y - x) * self.demand.pdf(y), x)
    
    def expected_backorder(self, Q=None, r=None):
        return np.sum(np.fromfunction(lambda x: self.backorder(np.round(r) + x), (np.round(Q).astype("int")+1,)))/Q if Q and r else self.expected_backorder(self.Q, self.r)

    def expected_inventory(self, Q=None, r=None):
        return Q/2 + r - self.demand.mean + self.expected_backorder(Q, r) if Q and r else self.expected_inventory(self.Q, self.r)

    def fill_rate(self, Q=None, r=None):
        return 1 - (self.backorder(r) - self.backorder(r + Q))/Q if Q and r else self.fill_rate(self.Q, self.r)

    def expected_stockout(self, Q=None, r=None):
        return self.demand.mean * (1 - self.fill_rate(Q, r)) if Q and r else self.expected_stockout(self.Q, self.r)

    def fixed_cost(self, Q=None, r=None):
        return self.costs.A * self.demand.mean / Q if Q and r else self.fixed_cost(self.Q, self.r)

    def holding_cost(self, Q=None, r=None):
        return self.costs.h * self.expected_inventory(Q, r) if Q and r else self.holding_cost(self.Q, self.r)

    def backorder_cost(self, Q=None, r=None):
        return self.costs.b * self.expected_backorder(Q, r) if Q and r else self.backorder_cost(self.Q, self.r)

    def stockout_cost(self, Q=None, r=None):
        return self.costs.k * self.demand.mean * (1 - self.expected_stockout(Q, r)) if Q and r else self.stockout_cost(self.Q, self.r)

    def expected_cost_backorder(self, Q=None, r=None):
        if not (Q and r): return self.expected_cost_backorder(self.Q, self.r)
        B = self.expected_backorder(Q, r)
        I = Q/2 + r - self.demand.mean + B
        return self.costs.A * self.demand.mean/Q + self.costs.h * I + self.costs.b * B

    def expected_cost_stockout(self, Q=None, r=None):
        if not (Q and r): return self.expected_cost_stockout(self.Q, self.r)
        B = self.expected_backorder(Q, r)
        I = Q/2 + r - self.demand.mean + B
        stockout_cost = self.costs.k * (self.demand.mean * (self.backorder(r) - self.backorder(r+Q))/Q)
        return self.costs.A * self.demand.mean/Q + self.costs.h * I + stockout_cost
