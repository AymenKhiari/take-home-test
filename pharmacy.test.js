import {Drug, Pharmacy} from "./pharmacy";
import {DRUGS_NAMES} from "./pharmacy";

describe("Pharmacy", () => {
    it("should decrease the benefit and expiresIn", () => {
        const drugs = [new Drug("test", 2, 3)];
        const pharmacy = new Pharmacy(drugs);
        expect(pharmacy.updateBenefitValue()).toEqual(
            [new Drug("test", 1, 2)],
        );
    });
    it("should decrease the benefit of Dafalgan four times as fast after expiration", () => {
        const drugs = [new Drug(DRUGS_NAMES.DAFALGAN, 0, 10)];
        const pharmacy = new Pharmacy(drugs);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs).toEqual(
            [new Drug(DRUGS_NAMES.DAFALGAN, -1, 6)]
        );
    })

    it("should decrease the benefit of Dafalgan twice as fast before expiration", () => {
        const drugs = [new Drug(DRUGS_NAMES.DAFALGAN, 3, 10)];
        const pharmacy = new Pharmacy(drugs);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs).toEqual(
            [new Drug(DRUGS_NAMES.DAFALGAN, 2, 8)]
        );
    });


    it("should not decrease the benefit of Dafalgan below 0", () => {
        const drugs = [new Drug(DRUGS_NAMES.DAFALGAN, 5, 1)];
        const pharmacy = new Pharmacy(drugs);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs).toEqual(
            [new Drug(DRUGS_NAMES.DAFALGAN, 4, 0)]
        );
    });

    it("should decrease the expiresIn for Dafalgan", () => {
        const drugs = [new Drug(DRUGS_NAMES.DAFALGAN, 3, 10)];
        const pharmacy = new Pharmacy(drugs);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs).toEqual(
            [new Drug(DRUGS_NAMES.DAFALGAN, 2, 8)]
        );
    });


    it("should decrease the expiresIn for Herbal Tea and te benefits should not pass 50", () => {
        const drugs = [new Drug(DRUGS_NAMES.HERBAL_TEA, 3, 49)];
        const pharmacy = new Pharmacy(drugs);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs).toEqual(
            [new Drug(DRUGS_NAMES.HERBAL_TEA, 2, 50)]
        );
    });


    it("should not change anything in the expiration of Magic Bill and in its benefits ", () => {
        const drugs = [new Drug(DRUGS_NAMES.MAGIC_PILL, 3, 49)];
        const pharmacy = new Pharmacy(drugs);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs).toEqual(
            [new Drug(DRUGS_NAMES.MAGIC_PILL, 3, 49)]
        );
    });

});

