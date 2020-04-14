import numpy as np
import matplotlib.pyplot as plt
import scipy.stats as stats
import scipy.optimize as optimize
from distribution import Demand
from tqdm import tqdm

# setter: a setter for the parameter.
# centroid: central value of parameter.
# limit: magnitude of value to explore in either direction.
# measures: list of methods that returns what we want to measure.
# points: number of points to sample.
def vary(setter, centroid, limit, measures, points=50):
    step = 2 * limit / (points-1)
    values = np.arange(centroid-limit, centroid+limit+step/2, step)
    results = np.zeros((points, len(measures)))

    for i, val in enumerate(tqdm(values)):
        setter(val)
        for j, measure in enumerate(measures):
            results[i,j] = measure()

    setter(centroid)
    return values, results.transpose()

def plot(x, ys):
    for i, y in enumerate(ys):
        plt.plot(x, y, label=i)
    plt.xlabel("Parameter")
    plt.ylabel("Measure")
    plt.legend()
    plt.show()


def squish(array, size):
    array = np.copy(array)
    array = np.append(array, np.zeros(size - array.shape[0] % size))
    return np.sum(array.reshape(-1, size), axis=1).astype("int")

def normalize(variable):
    return variable/np.sum(variable)

def fit_distribution(pdf, x, y):
    params, pcov = optimize.curve_fit(pdf, x, normalize(y), bounds=([0, 0, 0], [np.inf, np.inf, 1]))
    perr = np.sqrt(np.diag(pcov))
    k = len(params)
    n = len(x)
    L = np.sum(np.square(y - pdf(x, *params) * np.sum(y))) / n
    bic = n*np.log(L) + k*np.log(n)
    return params, perr, bic

def plot_fit_distribution(variable, pdf, name):
    y = np.bincount(variable)
    x = np.arange(np.max(variable) + 1)
    params, perr, bic = fit_distribution(pdf, x, y)
    dist = pdf(x, *params) * np.sum(y)
    QtoN = lambda z: z / np.sum(y)
    NtoQ = lambda z: z * np.sum(y)
    # cdist = lambda x: cdf(x, *params)
    # ks = stats.kstest(variable, cdist)

    print("parameters = {}, perr = {}, bic = {}".format(params, perr, bic))
    # print(ks)
    print("variable statistics: mean = {}, stdev = {}".format(np.mean(variable), np.std(variable)))

    fig, ax = plt.subplots()
    ax.stem(x, y, use_line_collection=True)
    ax.plot(x, dist, color="magenta")
    ax.secondary_yaxis("right", functions=(QtoN, NtoQ))
    plt.title(name)
    plt.show()
    return params

def extrapolate_sample(sample, multiplier):
    expectation = np.mean(sample)
    variance = np.std(sample) ** 2
    return Demand(expectation * multiplier, np.sqrt(variance * multiplier), 1)

def extrapolate(demand, multiplier):
    f = lambda x: x * demand.pdf(x)
    expectation = infsum(f, -1)
    f = lambda x: x**2 * demand.pdf(x)
    variance = infsum(f, -1) - expectation ** 2
    return Demand(expectation * multiplier, np.sqrt(variance * multiplier), 1)