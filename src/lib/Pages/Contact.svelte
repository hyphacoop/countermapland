<script>
    let subject = '';
    let message = '';
    let relatedTo = ''; // Assuming "submission", "error", "collaboration", "other" as options
    let preferredName = '';
    let email = '';
  
    // Function to handle form submission
    const handleSubmit = () => {
      // Here will need to implement the form submission logic here (with Staticman?)

      console.log({ subject, message, relatedTo, preferredName, email });
      
      // Reset form fields after submission
      subject = '';
      message = '';
      relatedTo = '';
      preferredName = '';
      email = '';
    };
  </script>
  
  <form on:submit|preventDefault={handleSubmit}>
    <div>
        <label for="preferredName">Preferred name:*</label>
        <br>
        <input id="preferredName" type="text" bind:value={preferredName} required>
      </div>
  
    <div>
      <label for="subject">Subject*</label>
      <br>
      <input id="subject" type="text" bind:value={subject} required>
    </div>
    
    <div>
        <label for="email">Email:*</label>
        <br>
        <input id="email" type="email" bind:value={email} required>
      </div>
      
    
    <div>
      <label for="relatedTo">This is related to:*</label>
      <br>
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
        <br>
        <textarea id="message" bind:value={message} required></textarea>
      </div>


    <button type="submit">Submit</button>

        
    <div class='required'>
        * Required fields
      </div>
  </form>
  
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
        input, select, textarea {
            padding: 0.25rem;
            border-radius: 0.25rem;
        }
        textarea {
            width: 100%;
        }
  </style>