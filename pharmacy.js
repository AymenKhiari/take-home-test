/**
 * Enum representing the names of all drugs handled by the system.
 */
export const DRUGS_NAMES = {
    DOLIPRANE: "Doliprane",
    HERBAL_TEA: "Herbal Tea",
    FERVEX: "Fervex",
    MAGIC_PILL: "Magic Pill",
    DAFALGAN: "Dafalgan",
};

/**
 * Enum defining the behavior for each drug type.
 * Includes information such as increase/decrease amounts and degradation multipliers.
 */
export const DRUGS_BEHAVIOR = {
    [DRUGS_NAMES.HERBAL_TEA]: {
        decreaseAmount: 0,
        increaseAmountBeforeExpiration: 1,
        increaseAmountAfterExpiration: 2,
    },
    [DRUGS_NAMES.FERVEX]: {
        decreaseAmount: 0,
        increaseAmounts: {
            default: 1,
            lessThan10Days: 2,
            lessThan5Days: 3,
            afterExpiry: 0,
        },
    },
    [DRUGS_NAMES.MAGIC_PILL]: {decreaseAmount: 0, increaseAmount: 0},
    [DRUGS_NAMES.DAFALGAN]: {
        decreaseAmount: 2,
        increaseAmount: 0,
    },
};

/**
 * Default behavior for drugs not explicitly defined in `DRUGS_BEHAVIOR`.
 */
export const DEFAULT_DRUGS_BEHAVIOR = {decreaseAmount: 1, increaseAmount: 0};

/**
 * Multiplier used for post-expiration degradation.
 */
export const multiple_value = 2;

/**
 * Represents a drug with a name, expiration date, and benefit value.
 */
export class Drug {
    constructor(name, expiresIn, benefit) {
        this.name = name;
        this.expiresIn = expiresIn;
        this.benefit = benefit;
    }
}


export class Pharmacy {
    constructor(drugs = []) {
        this.drugs = drugs;
    }

    /**
     * Updates the benefit and expiration of all drugs in the pharmacy.
     * Calls `handleNotExpired` for non-expired drugs and `handleExpired` for expired ones.
     * Returns the updated list of drugs.
     */
    updateBenefitValue() {
        this.drugs.forEach((drug) => {
            const behavior = DRUGS_BEHAVIOR[drug.name] || DEFAULT_DRUGS_BEHAVIOR;
            if (drug.expiresIn > 0) {
                this.handleNotExpired(drug, behavior);
                this.decreaseExpiresIn(drug);
            } else {
                this.handleExpired(drug, behavior);
            }
        });

        return this.drugs;
    }

    /**
     * Decreases the `expiresIn` value of a drug, unless it is the Magic Pill.
     */
    decreaseExpiresIn(drug) {
        if (drug.name !== DRUGS_NAMES.MAGIC_PILL) {
            drug.expiresIn -= 1;
        }
    }

    /**
     * Handles the behavior of Herbal Tea, increasing its benefit.
     */
    updateHerbalTea(drug, behavior) {
        if (drug.expiresIn < 0) {
            this.increaseBenefit(drug, behavior.increaseAmountAfterExpiration);
        } else {
            this.increaseBenefit(drug, behavior.increaseAmountBeforeExpiration);
        }
    }

    /**
     * Handles the behavior of Fervex, increasing its benefit as it nears expiration.
     * Drops the benefit to 0 after expiration.
     */
    updateFervex(drug, behavior) {
        if (drug.expiresIn <= 0) {
            drug.benefit = behavior.increaseAmounts.afterExpiry;
        } else if (drug.expiresIn <= 5) {
            this.increaseBenefit(drug, behavior.increaseAmounts.lessThan5Days);
        } else if (drug.expiresIn <= 10) {
            this.increaseBenefit(drug, behavior.increaseAmounts.lessThan10Days);
        } else {
            this.increaseBenefit(drug, behavior.increaseAmounts.default);
        }
    }

    /**
     * Handles the behavior of Dafalgan, decreasing its benefit faster than normal drugs.
     */
    updateDafalgan(drug, behavior) {
        this.decreaseBenefit(drug, behavior.decreaseAmount);
    }

    /**
     * Handles the behavior of normal drugs, decreasing their benefit.
     */
    updateNormalDrug(drug, behavior) {
        this.decreaseBenefit(drug, behavior.decreaseAmount);
    }

    /**
     * Handles the behavior of drugs that have not expired.
     * Delegates logic to the appropriate drug-specific method.
     */
    handleNotExpired(drug, behavior) {
        switch (drug.name) {
            case DRUGS_NAMES.HERBAL_TEA:
                this.updateHerbalTea(drug, behavior);
                break;
            case DRUGS_NAMES.FERVEX:
                this.updateFervex(drug, behavior);
                break;
            case DRUGS_NAMES.MAGIC_PILL:
                // Magic Pill does not change
                break;
            case DRUGS_NAMES.DAFALGAN:
                this.updateDafalgan(drug, behavior);
                break;
            default:
                this.updateNormalDrug(drug, behavior);
        }
    }

    /**
     * Handles the behavior of drugs that have expired.
     * Applies accelerated degradation or specific rules for each drug type.
     */
    handleExpired(drug, behavior) {
        switch (drug.name) {
            case DRUGS_NAMES.HERBAL_TEA:
                this.increaseBenefit(drug, behavior.increaseAmount);
                break;
            case DRUGS_NAMES.FERVEX:
                drug.benefit = behavior.increaseAmounts.afterExpiry;
                break;
            case DRUGS_NAMES.DAFALGAN:
                this.decreaseBenefit(drug, behavior.decreaseAmount * multiple_value);
                break;
            default:
                this.decreaseBenefit(drug, behavior.decreaseAmount * multiple_value);
        }
    }

    /**
     * Increases the benefit of a drug up to a maximum value.
     */
    increaseBenefit(drug, amount, maxBenefit = 50) {
        if (drug.benefit + amount > maxBenefit) {
            drug.benefit = maxBenefit;
        } else {
            drug.benefit += amount;
        }
    }

    /**
     * Decreases the benefit of a drug down to a minimum value.
     */
    decreaseBenefit(drug, amount, minBenefit = 0) {
        if (drug.benefit - amount < minBenefit) {
            drug.benefit = minBenefit;
        } else {
            drug.benefit -= amount;
        }
    }
}
