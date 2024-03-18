<script>
  import { onMount } from "svelte";

  let isSubmitting = false;
  let subject = "";
  let message = "";
  let relatedTo = ""; 
  let preferredName = "";
  let email = "";
  let success = false;
  let serverResponds = false;
  let errorMessage = "";

  const staticmanURL = "https://countermap.onrender.com/";
  const staticmanEndpoint = `${staticmanURL}v3/entry/github/hyphacoop/countermapland/staging/contactForm/`;

  // Function to handle form submission
  async function handleSubmit() {
    isSubmitting = true;
    let payload = new URLSearchParams();

    // Adapted for the new form fields
    payload.append("fields[preferredName]", preferredName);
    payload.append("fields[email]", email);
    payload.append("fields[relatedTo]", relatedTo);
    payload.append("fields[subject]", subject);
    payload.append("fields[message]", message);
    try {
        console.log("Submitting form:", payload);
        const response = await fetch(
            staticmanEndpoint,
            {
                method: "POST",
                body: payload,
            }
        );

        if (response.ok) {
            success = true;
            isSubmitting = false;
            console.log(
                "Form submitted successfully:",
                response.status,
                response.statusText
            );
        } else {
            isSubmitting = false;
            errorMessage = "Failed to submit form. Please try again later.";
            console.log(
                "Error submitting form:",
                response.status,
                response.statusText
            );
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        isSubmitting = false;
        errorMessage = "Error submitting form. Please check your internet connection and try again.";
    }

    // Reset form fields after submission
    subject = "";
    message = "";
    relatedTo = "";
    preferredName = "";
    email = "";
  };

  
  async function verifyServerResponds() {
    if (!serverResponds) {
      try {
          // Sending a request to wake up the server
          const response = await fetch(staticmanURL, {
              method: 'GET',
            });
            if (response.ok) {
              const text = await response.text(); // Retrieves the response body as plain text
              if (text.includes("Hello from Staticman version 3.0.0!")) {
                  console.log("Staticman is active:", text.match(/Hello from Staticman version 3.0.0!/g));
                  serverResponds = true;
              } else {
                  console.log('Server response does not include the expected message.');
              }
          } else {
              console.log('Server response:', response.status, response.statusText);
          }
      } catch (error) {
          console.error('Error waking up the server:', error);
      }
    }
  }

  onMount(() => {
    verifyServerResponds();
  });

  $: submitText = isSubmitting ? "Submitting" : "Submit";
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div>
    <label for="preferredName">Preferred name:*</label>
    <br />
    <input id="preferredName" type="text" bind:value={preferredName} required />
  </div>

  <div>
    <label for="subject">Subject*</label>
    <br />
    <input id="subject" type="text" bind:value={subject} required />
  </div>

  <div>
    <label for="email">Email:*</label>
    <br />
    <input id="email" type="email" bind:value={email} required />
  </div>

  <div>
    <label for="relatedTo">This is related to:*</label>
    <br />
    <select id="relatedTo" bind:value={relatedTo} required>
      <option value="" disabled selected>Select an option</option>
      <option value="submission">Submission</option>
      <option value="error">Error</option>
      <option value="collaboration">Collaboration</option>
      <option value="other">Other</option>
    </select>
  </div>

  <div>
    <label for="message">Message*</label>
    <br />
    <textarea id="message" bind:value={message} required></textarea>
  </div>

  <button type="submit">
    {submitText}
    {#if isSubmitting}
      <span class="dot">.</span><span class="dot">.</span><span class="dot"
        >.</span
      >
    {/if}
  </button>

  <div class="required">* Required fields</div>
</form>
{#if success}
<h2>Thank you</h2>
<p class="success">Your submission has been received.</p>
{/if}
{#if errorMessage}
<p class="error">{errorMessage}</p>
{/if}
<style>
  div {
    margin-bottom: 1.5rem;
  }
  button {
    padding: 0.4rem 2rem;
    border-radius: 0.25rem;
    border: 1px solid #000;
  }
  .required {
    margin-top: 2rem;
  }
  input,
  select,
  textarea {
    padding: 0.25rem;
    border-radius: 0.25rem;
  }
  textarea {
    width: 100%;
  }

  .dot {
    animation: blink 1.4s infinite both;
    display: inline-block;
    margin-left: 4px;
  }

  .dot:nth-child(1) {
    animation-delay: 0s;
  }
  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }
</style>
