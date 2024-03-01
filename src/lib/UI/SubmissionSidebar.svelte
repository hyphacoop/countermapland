<script>
  import { fly } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  import { userLatLng } from "$lib/stores";

  import countermonumentOutlineIcon from "$lib/icons/countermonument-outline.svg";
  import monumentOutlineIcon from "$lib/icons/monument-outline.svg";
  import countermonumentIcon from "$lib/icons/countermonument.svg";
  import monumentIcon from "$lib/icons/monument.svg";
  import closeImage from "$lib/icons/close.svg";

  let names = [{ id: "name1", value: "" }];
  let altText;
  let description;
  let file;
  let dynamicFieldValues = {};
  let consentGiven = false;
  let powerDominanceAnswer = null;

  const dispatch = createEventDispatcher();

  let senses = ["see", "hear", "smell", "taste", "touch"];
  let media = ["drawing", "photo", "poem", "recipe", "perfume"];
  let fields = [
  "Year",
  "Artist",
  "Agencies sponsoring",
  "Monument inscription",
  "Subjects represented",
  "Honorees",
  "Object type (e.g. stele, plaque, cairn)",
  "Material",
  "Area",
  "Height (m)",
  "Width",
  "Depth",
  "Staging tactics",
  "Gestures"
];

const fieldMapping = {
  "Year": "year",
  "Artist": "artist",
  "Agencies sponsoring": "agencies",
  "Monument inscription": "inscription",
  "Subjects represented": "subjects",
  "Honorees": "honorees",
  "Object type (e.g. stele, plaque, cairn)": "objectType",
  "Material": "material",
  "Area": "area",
  "Height (m)": "height",
  "Width": "width",
  "Depth": "depth",
  "Staging tactics": "tactics",
  "Gestures": "gestures"
};



  let success = false;
  let email;
  let activeInfoButtons = {};
  let selectedSense = senses[0];
  let selectedMedia = media[0];

  function isPower(value) {
    powerDominanceAnswer = value;
  }

  function addName() {
    const nextId = `name${names.length + 1}`;
    names.push({ id: nextId, value: "" });
    names = names;
  }

  function toggleInfoButton(info) {
    activeInfoButtons[info] = !activeInfoButtons[info];
  }

  function selectRandomFromArray(array, current, setterFunction) {
    const filteredArray = array.filter(item => item !== current);
    const randomIndex = Math.floor(Math.random() * filteredArray.length);
    setterFunction(filteredArray[randomIndex]);
  }

  function closeSideBarEvent() {
    dispatch("closeSideBar");
  }

  async function handleSubmit() {
  // Prevent the default form submission logic if you're calling this function on form submit
  const latLngValue = `${$userLatLng.lat},${$userLatLng.lng}`;

  const challengesPowerString = powerDominanceAnswer === 'yes' ? 'true' : 'false';


  // Construct your payload here, mapping fields as necessary
  let payload = {
    'fields[latLng]': latLngValue,
    'fields[challengesPower]': challengesPowerString,
    'fields[description]': description,
    'fields[altText]': altText,
    'fields[email]': email,
    // Other fields can be added here but they also need to match the structure defined in staticman.yml
  };

  // Include dynamic names handling
  names.forEach((name, index) => {
    if (name.value) payload[`fields[name${index + 1}]`] = name.value;
  });

  // Adjusting the payload construction to use the robust mapping
  Object.entries(dynamicFieldValues).forEach(([userFriendlyName, value]) => {
    if (value) {
      const technicalName = fieldMapping[userFriendlyName]; // Use the mapping to get the technical field name
      if (technicalName) {
        payload[`fields[${technicalName}]`] = value;
      }
    }
  });

  // Before sending the request, filter out empty fields
  payload = Object.fromEntries(Object.entries(payload).filter(([_, value]) => value != null && value !== ''));

  try {
      console.log('Submitting form:', payload);
      const response = await fetch('https://countermap.onrender.com/v3/entry/github/hyphacoop/countermapland/staging/submissions/', {
        method: 'POST',
        body: JSON.stringify(payload), // You might need to adjust this based on how your server expects the payload
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        success = true;
        console.log('Form submitted successfully:', response.status, response.statusText);
      } else {
        // Handle errors (e.g., show an error message)
        console.log('Error submitting form:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
}

</script>

<div
  class="sidebar"
  in:fly={{ x: 300, duration: 800 }}
  out:fly={{ x: 300, duration: 800 }}
>
<button class="close-button" on:click={closeSideBarEvent} >
  <img src={closeImage} alt="Close Sidebar"/>
</button>
  <h2>Add to *countermap</h2>

  {#if success}
    <p class='success'>Thank you for your submission!</p>
  {/if}

  <p class='main-description'>
    A (counter)monument can be an event, ecology, object, or site that is
    important to a community. It may have been erased, still exist, or be
    speculative.
  </p>
  <p class='main-description'>
    We review each submission before adding it to the map in order to ensure
    this remains a safe digital space.
  </p>

  <p class='main-description'>
    Please read our <i>Community Agreements</i> to learn more.
  </p>

  <h3>Leave a marker</h3>
  <p>{ $userLatLng ? $userLatLng : 'Click on the countermap to mark the location of this place.'}</p>

  <h3>What do you call this place?</h3>
  <p>This can be an “official” name, a name that you use, or something else.</p>
 
 <div class="flex flex-col names items-start mb-4">
  {#each names as name, index (name.id)}
  <input type="text" bind:value={names[index].value} placeholder="Enter a name" id={name.id} required />
{/each}
<button class='add-another-name' on:click={addName}>Add another name</button>

</div>


  <h3>Does this place challenge dominant systems of power?</h3>

  <div class="flex flex-col yes-no mb-4">
    <button on:click={() => isPower("yes")}>
      {#if powerDominanceAnswer === "yes"}
        <img src={countermonumentIcon} alt="Yes" class="icon" />
      {:else}
        <img src={countermonumentOutlineIcon} alt="Yes outline" class="icon" />
      {/if}
      yes
    </button>

    <button on:click={() => isPower("no")}>
      {#if powerDominanceAnswer === "no"}
        <img src={monumentIcon} alt="No" />
      {:else}
        <img src={monumentOutlineIcon} alt="No outline" />
      {/if}
      no
    </button>
  </div>

  <h3>What do you know about this place?</h3>
  <p>What is its significance?</p>
  <p>Who does it belong to?</p>
  <p>How do you encounter it?</p>
  <textarea class='mb-2' id="message" bind:value={description} required></textarea>

  <p class='mb-0'>Add more information:</p>
  <div class="flex flex-row more-btns mb-4">
    {#each fields as info}
      <button class='rounded'
        class:active={activeInfoButtons[info]}
        on:click={() => toggleInfoButton(info)}
      >
        {info}
      </button>
    {/each}
  </div>
  <div class="flex flex-col more-info mb-4">
    {#each Object.keys(activeInfoButtons).filter(info => activeInfoButtons[info]) as activeInfo}
      <input type="text" bind:value={dynamicFieldValues[activeInfo]} placeholder={`Enter ${activeInfo} details`} />
    {/each}
  </div>  

  <h3>How do you experience this place?</h3>

  <p>Optional: Click on the labels to create a prompt.</p>

  <!-- Dynamic senses and media buttons -->
  <div class="prompt flex flex-row flex-wrap justify-center items-center mb-4 rounded">
    Share something you can
    <button class='rounded'
    on:click={() =>
      selectRandomFromArray(senses, selectedSense, (value) => (selectedSense = value))}
    >{selectedSense}</button
  >
  in the form of a
  <button class='rounded'
    on:click={() =>
      selectRandomFromArray(media, selectedMedia, (value) => (selectedMedia = value))}
    >{selectedMedia}</button
  >
  </div>

  <p>Share a file (audio, video, image, text) that represents this place.</p>

  <!-- File input with drag and drop -->
  <input type="file" bind:files={file} id="file" hidden />
  <label for="file" class="file-dropzone mb-4">
    Choose a file or drop one here.
  </label>

  <p>Describe this image</p>
  <textarea class='mb-4' bind:value={altText}></textarea>

  <h3>Email</h3>
  <input class='mb-4' id="email" type="email" bind:value={email} required />

  <p class='my-4'>
    <label class="custom-radio">
      <input type="radio" bind:group={consentGiven} value={true} class="hidden-radio" />
      <svg class="radio-svg" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" on:click={() => consentGiven = true}>
        <circle cx="7" cy="7" r="6.5" stroke="black" fill={consentGiven ? 'black' : 'none'}/>
      </svg>
      Let *countermap record and reuse the information you shared. Read our User and Community Agreements here.
    </label>
    
</p>
  <button class="submit rounded mb-4" disabled={!consentGiven} on:click={handleSubmit}>Submit</button>
</div>

<style>

.close-button {
    position: absolute;
    top: 1.19rem;
    right: 1.19rem;
    z-index: 9999;
  }
  .sidebar {
    width: 450px;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    background: #40b37c;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
    overflow-y: auto;
    z-index: 9999;
    padding: 0 1.88rem;
    padding-top: 2.69rem;
  }
  h2 {
    color: #000;
    font-family: Itim;
    font-size: 2.0625rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-bottom: 2.19rem;
  }

  h3 {
    color: #000;
    font-family: Itim;
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-bottom: 0.94rem;
  }
  .icon {
    width: 22px;
    height: auto;
  }
  p, label {
    font-size: 0.75rem; 
  }
  p {
    color: #000;
    font-family: "BCSans";
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-bottom: 1.5rem;
  }
  p.main-description {
    font-size: 0.875rem;
  }
  .prompt {
    display: flex;
    font-size: 0.75rem; 
    padding: 1.1875rem 1.4375rem;
    justify-content: center;
    align-items: center;
    gap: 0.4375rem;
    border: 1px solid #000;
  }
  .prompt button {
    padding: 0.125rem 0.625rem; 
    border: 1px solid #000;
  }
  .submit {
    padding: 0.4rem 2rem;
    border: 1px solid #000;
  }
  button.active {
    background-color: #000;
    color: #fff;
  }

  .file-dropzone {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    border: 2px dashed #000;
    margin-top: 20px;
    cursor: pointer;
  }
  .more-btns {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
  }
  .more-btns button {
    margin-right: 0.5rem;
    border: 1px solid #000;
    padding: 0.125rem 0.625rem; 
  }

  .more-info input {
    margin: 0.5rem 0;
  }

  .yes-no button {
    display: flex;
    align-items: left;
    justify-content: left;
    gap: 0.5rem;
    padding: 0.25rem;
  }

  .add-another-name {
    color: #000;
    font-family: "BCSans";
    font-size: 0.625rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-decoration-line: underline;
  }
  textarea {
    width: 100%;
  }

  textarea, input {
    padding: 0.25rem;
    border-radius: 0.25rem; 
  }
  .names input {
    margin-bottom: 0.5rem;
    width: 50%;
  }
  .custom-radio {
  display: flex;
  align-items: center;
  gap: 8px; /* Adjust as needed */
  cursor: pointer;
}

.hidden-radio {
  opacity: 0;
  position: absolute;
  pointer-events: none;
}

.radio-svg {
  width: 0.875rem; 
  height: 0.875rem; 
  flex-shrink: 0;
}

.radio-svg circle {
  stroke-width: 1px;
}

</style>
