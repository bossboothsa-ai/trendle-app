async function testConnection() {
    console.log("Testing connection to http://localhost:3000...");
    try {
        const response = await fetch("http://localhost:3000");
        console.log(`Response Status: ${response.status}`);
        if (response.ok || response.status === 404 || response.status === 200) {
            console.log("Server is UP!");
        } else {
            console.log("Server responded with error.");
        }
    } catch (e) {
        console.log("Server is NOT reachable yet: " + e.message);
    }
}
testConnection();
