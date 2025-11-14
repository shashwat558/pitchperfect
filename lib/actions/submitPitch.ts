export async function submitPitch(payload) {
    const res = await fetch("/api/pitch/start", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),


    })
    if(!res.ok){
        throw new Error("failed to submit")
    }
    return res.json()
}