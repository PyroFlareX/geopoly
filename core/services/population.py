


def getNaturalGrowth(R0, Tc, e0, sigD):
    """
    Returns difference between per-capita birth and death rates.

    Source: Linking the Population Growth Rate and the Age-at-Death Distribution
        Susanne Schindler,1 Shripad Tuljapurkar,2 Jean-Michel Gaillard,3 and Tim Coulson4
        https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3793508/

    :param R0: mean lifetime reproductive success
    :param Tc: cohort generation time
    :param e0: life expectancy
    :param sigD: variance around life expectancy distribution (assuming normal distribution)

    :return: natural growth: birth rate - death rate difference
    """
    uD = e0 ** 2 + sigD ** 2

    r = (R0 - 1) / (R0 * Tc - ((R0 - 1) / 2) * (uD / e0))

    return r


if __name__ == "__main__":
    R0 = 1.6
    Tc = 19

    # life_exp = [20,35]
    # life expectancy: we assume that it's a distribution of μ=40, σ=12
    e0 = 40
    sigD = 12

    pop = 15000

    r = getNaturalGrowth(R0, Tc, e0, sigD)

    print(r * pop)
