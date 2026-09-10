const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Step 1: Create the login account
    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password
    });

    if (error) {
        alert(error.message);
        return;
    }

    // Step 2: Create the profile
    const { error: profileError } = await supabaseClient
        .from("profiles")
        .insert([
            {
                full_name: fullName,
                status: "pending"
            }
        ]);

    if (profileError) {
        console.error(profileError);
        alert(profileError.message);
        return;
    }

    alert("Registration successful!");
});