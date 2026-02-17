
import { storage } from "../server/mockStorage";

async function verifyBusinessSettings() {
    console.log("Starting Business Settings Verification...");

    // 1. Seed (Ember & Oak is Overdue by default from previous seed update)
    await storage.seed();
    const placeId = 1;

    // 2. Verify Overdue Status
    let account = await storage.getBusinessAccountByPlaceId(placeId);
    if (account?.invoiceStatus === "Overdue") {
        console.log("PASS: Business initialized as Overdue (Banner should be visible)");
    } else {
        console.error(`FAIL: Business status is ${account?.invoiceStatus}`);
    }

    // 3. Update Business Profile (Name/Contact)
    console.log("Updating Business Profile...");
    const updated = await storage.updateBusinessAccount(account!.id, {
        businessName: "Ember & Oak Renamed",
        contactEmail: "newemail@ember.com"
    });

    if (updated.businessName === "Ember & Oak Renamed" && updated.contactEmail === "newemail@ember.com") {
        console.log("PASS: Business Profile Updated");
    } else {
        console.error("FAIL: Business Profile Update failed");
    }

    // 4. Update Billing Info
    console.log("Updating Billing Info...");
    const billingUpdate = await storage.updateBusinessBilling(account!.id, {
        billingAddress: "99 New St",
        taxId: "ZA999999"
    });

    if (billingUpdate.billingAddress === "99 New St" && billingUpdate.taxId === "ZA999999") {
        console.log("PASS: Billing Info Updated");
    } else {
        console.error("FAIL: Billing Info Update failed");
    }

    console.log("Business Settings Verification Complete.");
}

verifyBusinessSettings().catch(console.error);
