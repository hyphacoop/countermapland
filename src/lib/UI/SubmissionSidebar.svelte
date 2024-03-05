<script>
  import { base } from "$app/paths";
  import { fly } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  import { userLatLng, currentSidebar, currentMenuSection } from "$lib/stores";

  import { uploadImage } from "$lib/Map/utilities";

  import countermonumentOutlineIcon from "$lib/icons/countermonument-outline.svg";
  import monumentOutlineIcon from "$lib/icons/monument-outline.svg";
  import countermonumentIcon from "$lib/icons/countermonument.svg";
  import monumentIcon from "$lib/icons/monument.svg";
  import closeImage from "$lib/icons/close.svg";

  export let objectView = false;

  let names = [{ id: "name1", value: "" }];
  let altText;
  let description;
  let dynamicFieldValues = {};
  let consentGiven = false;
  let powerDominanceAnswer = null;
  let success = false;
  let submitting = false;
  let errorMessage = false;
  let email;
  let files;
  let file = null;
  let activeInfoButtons = {};

  let senses = ["see", "hear", "smell", "taste", "touch"];
  let media = ["drawing", "photo", "poem", "recipe", "perfume"];

  let selectedSense = senses[0];
  let selectedMedia = media[0];

  const dispatch = createEventDispatcher();

  $: isFormValid = names.some(name => name.value.trim() !== '') && description && $userLatLng && email;

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
    "Gestures",
  ];

  const fieldMapping = {
    Year: "year",
    Artist: "artist",
    "Agencies sponsoring": "agencies",
    "Monument inscription": "inscription",
    "Subjects represented": "subjects",
    Honorees: "honorees",
    "Object type (e.g. stele, plaque, cairn)": "objectType",
    Material: "material",
    Area: "area",
    "Height (m)": "height",
    Width: "width",
    Depth: "depth",
    "Staging tactics": "tactics",
    Gestures: "gestures",
  };

  function resetForm() {
    names = [{ id: "name1", value: "" }];
    altText = "";
    description = "";
    dynamicFieldValues = {};
    consentGiven = false;
    powerDominanceAnswer = null;
    success = false;
    submitting = false;
    errorMessage = false;
    email = "";
    files = null;
    file = null;
    activeInfoButtons = {};
  }

  function isPower(value) {
    powerDominanceAnswer = value;
  }

  function addName() {
    if (names.length < 3) {
      const nextId = `name${names.length + 1}`;
      names.push({ id: nextId, value: "" });
      names = names;
    }
  }

  function toggleInfoButton(info) {
    activeInfoButtons[info] = !activeInfoButtons[info];
  }

  function selectRandomFromArray(array, current, setterFunction) {
    const filteredArray = array.filter((item) => item !== current);
    const randomIndex = Math.floor(Math.random() * filteredArray.length);
    setterFunction(filteredArray[randomIndex]);
  }

  function closeSideBarEvent() {
    dispatch("closeSideBar");
  }

  // Function to handle the file drop event
  async function handleDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files
    if (files && files.length > 0) {
      file = files[0]; // only using one file for now
    }
  }

  async function handleSubmit() {
    submitting = true;

    // Check if there's a file selected for upload
    let imageUrl = file ? await uploadImage(file) : null;

    // Constructing the URLSearchParams directly without initially including potentially undefined values
    let payload = new URLSearchParams();

    // Add fields conditionally
    payload.append("fields[latLng]", `${$userLatLng.lat},${$userLatLng.lng}`);
    payload.append(
      "fields[challengesPower]",
      powerDominanceAnswer === "yes" ? "true" : "false"
    );
    if (description) payload.append("fields[description]", description);
    payload.append("fields[email]", email);
    if (imageUrl) {
      payload.append("fields[media]", imageUrl);
    }
    if (altText) {
      payload.append("fields[altMedia]", altText);
    }

    // Handle dynamic names and other fields
    names.forEach((name, index) => {
      if (name.value) payload.append(`fields[name${index + 1}]`, name.value);
    });

    Object.entries(dynamicFieldValues).forEach(([userFriendlyName, value]) => {
      if (value) {
        const technicalName = fieldMapping[userFriendlyName];
        if (technicalName) {
          payload.append(`fields[${technicalName}]`, value);
        }
      }
    });
    try {
      console.log("Submitting form:", payload);
      const response = await fetch(
        "https://countermap.onrender.com/v3/entry/github/hyphacoop/countermapland/staging/submissions/",
        {
          method: "POST",
          body: payload,
        }
      );

      if (response.ok) {
        success = true;
        submitting = false;
        console.log(
          "Form submitted successfully:",
          response.status,
          response.statusText
        );
        $userLatLng = null;
      } else {
        // Handle errors (e.g., show an error message)
        submitting = false;
        errorMessage = true;
        console.log(
          "Error submitting form:",
          response.status,
          response.statusText
        );
        $userLatLng = null;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      errorMessage = true;
      $userLatLng = null;
    }
  }

  $: missingFields = [];
  $: {
    missingFields = []; // Reset the array on each reactivity cycle
    if (!names.some(name => name.value.trim() !== '')) missingFields.push("Name");
    if (!description) missingFields.push("Description");
    if (!$userLatLng) missingFields.push("Location (latitude/longitude)");
    if (!email) missingFields.push("Email");
  }

  function goToContactForm() {
    currentSidebar.set("menu");
    currentMenuSection.set("Contact");
  }

  function gotoComAgr() {
    currentSidebar.set("menu");
    currentMenuSection.set("Community Agreements");
  }

  $: if (files && files.length > 0) {
    file = files[0];
  } else {
    file = null;
  }

  $: submitText = submitting ? "Submitting" : "Submit";
</script>

<div
  class="sidebar"
  in:fly={{ x: 300, duration: 800 }}
  out:fly={{ x: 300, duration: 800 }}
>
  <button class="close-button" on:click={closeSideBarEvent}>
    <img src={closeImage} alt="Close Sidebar" />
  </button>
  {#if success}
    <h2>Thank you</h2>
    <p class="success">Your submission has been received.</p>
    <p>
      Our next review cycle starts on <span class="label ml-2 rounded"
        >date</span
      >
    </p>
    <p>Are you interested in volunteering to help review submissions?</p>
    <p>Reach out <a class="link" on:click={goToContactForm}>here</a></p>
  {:else if errorMessage}
    <h2>Something went wrong</h2>
    <p class="success">Your submission was not properly received.</p>
    <p>Get in touch or <a class='link' on:click={resetForm}>try again.</p>

    <p>Reach out <a class="link" on:click={goToContactForm}>here</a></p>
  {:else}
    <h2>Add a monument*</h2>

    <p class="main-description">
      A monument can be an event, ecology, object, or site that is
      important to a community. It may have been erased, still exist, or be
      speculative.
    </p>
    <p class="main-description">
      We review each submission before adding it to the map in order to ensure
      this remains a safe digital space.
    </p>

    <p class="main-description">
      Please read our <a class='link' on:click={gotoComAgr}>Community Agreements</a> to learn more.
    </p>

    <h3>Leave a marker</h3>
    {#if $userLatLng}
    <p>{$userLatLng}</p>
  {:else}
    <p>
      Click
      {#if objectView}
        {@html `<a href="${base}/map" class='underline'>here</a>`}
      {:else}
        on the countermap
      {/if}
      to mark the location of this place.
    </p>
{/if}
    <h3>What do you call this place?</h3>
    <p>
      This can be an “official” name, a name that you use, or something else.
    </p>

    <div class="flex flex-col names items-start mb-4">
      {#each names as name, index (name.id)}
        <input
          type="text"
          bind:value={names[index].value}
          placeholder="Enter a name"
          id={name.id}
          required
        />
      {/each}
      {#if names.length < 3}
        <button class="add-another-name" on:click={addName}
          >Add another name</button
        >
      {/if}
    </div>

    <h3>Countermonument</h3>
    <p>Does this place challenge dominant systems of power?</p>
    <div class="flex flex-col yes-no mb-4">
      <button on:click={() => isPower("yes")}>
        {#if powerDominanceAnswer === "yes"}
          <img src={countermonumentIcon} alt="Yes" class="icon" />
        {:else}
          <img
            src={countermonumentOutlineIcon}
            alt="Yes outline"
            class="icon"
          />
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

    <h3>Please give us more information</h3>
    <p class="mb-0">What is its significance?</p>
    <p class="mb-0">Who does it belong to?</p>
    <p class="mb-0">How do you encounter it?</p>
    <p class="mb-0">What do you remember?</p>
    <textarea class="mb-2" id="message" bind:value={description} required
    ></textarea>

    <h3>Add some tags:</h3>
    <div class="flex flex-row more-btns mb-4">
      {#each fields as info}
        <button
          class="rounded"
          class:active={activeInfoButtons[info]}
          on:click={() => toggleInfoButton(info)}
        >
          {info}
        </button>
      {/each}
    </div>
    <div class="flex flex-col more-info mb-4">
      {#each Object.keys(activeInfoButtons).filter((info) => activeInfoButtons[info]) as activeInfo}
        <input
          type="text"
          bind:value={dynamicFieldValues[activeInfo]}
          placeholder={`Enter ${activeInfo} details`}
        />
      {/each}
    </div>

    <h3>How do you experience this place?</h3>
    <p>Share an image that represents your experience with a place or write it below.
    </p>
    <p>Optional: Click on the labels to create a prompt.</p>

    <!-- Dynamic senses and media buttons -->
    <div
      class="prompt flex flex-row flex-wrap justify-center items-center mb-4 rounded"
    >
      Share something you can
      <button
        class="rounded"
        on:click={() =>
          selectRandomFromArray(
            senses,
            selectedSense,
            (value) => (selectedSense = value)
          )}>{selectedSense}</button
      >
      in the form of a
      <button
        class="rounded"
        on:click={() =>
          selectRandomFromArray(
            media,
            selectedMedia,
            (value) => (selectedMedia = value)
          )}>{selectedMedia}</button
      >
    </div>

    <p>Share a file (audio, video, image, text) that represents this place.</p>

    <!-- File input with drag and drop -->
    <input type="file" bind:files={files} id="file" hidden />
    <label for="file" class="file-dropzone mb-4"  on:drop|preventDefault={handleDrop} on:dragover|preventDefault> 
      Choose a file or drop one here.
    </label>
    {#if file}
      <p>File selected: {file.name}</p>
    {/if}
    <p>Describe this image</p>
    <textarea class="mb-4" bind:value={altText}></textarea>

    <h3>Email</h3>
    <input class="mb-4" id="email" type="email" bind:value={email} required />

    <p class="my-4">
      <label class="custom-radio">
        <input
          type="radio"
          bind:group={consentGiven}
          value={true}
          class="hidden-radio"
        />
        <svg
          class="radio-svg"
          viewBox="0 0 14 14"
          xmlns="http://www.w3.org/2000/svg"
          on:click={() => (consentGiven = true)}
        >
          <circle
            cx="7"
            cy="7"
            r="6.5"
            stroke="black"
            fill={consentGiven ? "black" : "none"}
          />
        </svg>
        Let *countermap record and reuse the information you shared. 
      </label>
    </p>

        <!-- Display missing fields -->
{#if missingFields.length > 0}
<p class="missing-fields">Missing required fields: {missingFields.join(", ")}</p>
{/if}

    <button
      class="submit rounded mb-4"
      disabled={!isFormValid || !consentGiven}
      on:click={handleSubmit}>{submitText}</button
    >

  {/if}
</div>

<style>
  .link {
    text-decoration: underline;
    cursor: pointer;
  }
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
  p,
  label {
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
  .prompt button,
  .label {
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

  textarea,
  input {
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
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      padding: 0 0.88rem;
      padding-top: 2rem;
    }
  }
</style>
