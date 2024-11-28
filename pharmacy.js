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
 * Default behavior for drugs not explicitly defined in `DRUGS_BEHAVIOR`.
 */

export const DEFAULT_DRUGS_BEHAVIOR = {decreaseBenefit: 1, increaseBenefit: 0};


/**
 * Multiplier used for post-expiration degradation.
 */
export const multiple_value = 2;


/**
 * Enum defining the behavior for each drug type.
 * Includes information such as increase/decrease Benefits and degradation multipliers.
 */
export const DRUGS_BEHAVIOR = {
    [DRUGS_NAMES.HERBAL_TEA]: {
        increaseBenefitBeforeExpiration: 1,
        increaseBenefitAfterExpiration: [DRUGS_NAMES.HERBAL_TEA].increaseBenefitBeforeExpiration * multiple_value,
    },
    [DRUGS_NAMES.FERVEX]: {
        increaseBenefits: {
            default: 1,
            lessThan10Days: 2,
            lessThan5Days: 3,
            afterExpiry: 0,
        },
    },
    [DRUGS_NAMES.MAGIC_PILL]: {decreaseBenefit: 0, increaseBenefit: 0},
    [DRUGS_NAMES.DAFALGAN]: {
        decreaseBenefit: DEFAULT_DRUGS_BEHAVIOR.decreaseBenefit * multiple_value,
    },

};


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
            } else {
                this.handleExpired(drug, behavior);
            }
            this.decreaseExpiresIn(drug);

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
            this.increaseBenefit(drug, behavior.increaseBenefitAfterExpiration);
        } else {
            this.increaseBenefit(drug, behavior.increaseBenefitBeforeExpiration);
        }
    }

    /**
     * Handles the behavior of Fervex, increasing its benefit as it nears expiration.
     * Drops the benefit to 0 after expiration.
     */
    updateFervex(drug, behavior) {
        if (drug.expiresIn <= 0) {
            drug.benefit = behavior.increaseBenefits.afterExpiry;
        } else if (drug.expiresIn <= 5 && drug.expiresIn > 0) {
            this.increaseBenefit(drug, behavior.increaseBenefits.lessThan5Days);
        } else if (drug.expiresIn <= 10 && drug.expiresIn > 5) {
            this.increaseBenefit(drug, behavior.increaseBenefits.lessThan10Days);
        } else {
            this.increaseBenefit(drug, behavior.increaseBenefits.default);
        }
    }

    /**
     * Handles the behavior of Dafalgan, decreasing its benefit faster than normal drugs.
     */
    updateDafalgan(drug, behavior) {
        if (drug.expiresIn < 0) {
            this.decreaseBenefit(drug, behavior.decreaseBenefit * multiple_value);
        } else {
            this.decreaseBenefit(drug, behavior.decreaseBenefit);
        }
    }

    /**
     * Handles the behavior of normal drugs, decreasing their benefit.
     */
    updateNormalDrug(drug, behavior) {
        this.decreaseBenefit(drug, behavior.decreaseBenefit);
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
                this.increaseBenefit(drug, behavior.increaseBenefit);
                break;
            case DRUGS_NAMES.FERVEX:
                drug.benefit = behavior.increaseBenefits.afterExpiry;
                break;
            case DRUGS_NAMES.DAFALGAN:
                this.decreaseBenefit(drug, behavior.decreaseBenefit * multiple_value);
                break;
            default:
                this.decreaseBenefit(drug, behavior.decreaseBenefit * multiple_value);
        }
    }

    /**
     * Increases the benefit of a drug up to a maximum value.
     */
    increaseBenefit(drug, Benefit, maxBenefit = 50) {
        if (drug.benefit + Benefit > maxBenefit) {
            drug.benefit = maxBenefit;
        } else {
            drug.benefit += Benefit;
        }
    }

    /**
     * Decreases the benefit of a drug down to a minimum value.
     */
    decreaseBenefit(drug, Benefit, minBenefit = 0) {
        if (drug.benefit - Benefit < minBenefit) {
            drug.benefit = minBenefit;
        } else {
            drug.benefit -= Benefit;
        }
    }
}
