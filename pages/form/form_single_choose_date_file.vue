<template>
  <div>
    <section>
      <h1>{{ response.details.inquiry_name }}</h1>

      <div>
        <template v-for="line in textLines2texts(response.details.inquiry_info)">
          {{ line }}<br />
        </template>
      </div>

      <div v-if="submitted">
        <template v-for="line in textLines2texts(response.details.thanks_text)">
          {{ line }}<br />
        </template>
      </div>

      <form v-else>
        <div v-if="error" class="error">
          <p v-for="(err, idx) in error" :key="idx" style="color: red">
            {{ err.message }}
          </p>
        </div>

        <div>
          <dl>
            <dt>Name</dt>
            <dd><input v-model="submitData.name" name="name" type="text" /></dd>
          </dl>
          <dl>
            <dt>Email</dt>
            <dd>
              <input
                v-model="submitData.from_mail"
                name="from_mail"
                type="text"
              />
            </dd>
          </dl>
          <dl>
            <dt>Message</dt>
            <dd><textarea v-model="submitData.body" name="body"></textarea></dd>
          </dl>
          <dl>
            <dt>Item</dt>
            <dd>
              <select v-model="submitData.ext_01" name="ext_01">
                <option
                  v-for="(value, key) in response.details.cols.filter(
                    (col) => col.key === 'ext_01'
                  )[0].options"
                  :key="key"
                  :label="value"
                  :value="key"
                >
                  {{ key }}:{{ value }}
                </option>
              </select>
            </dd>
          </dl>
          <dl>
            <dt>Date</dt>
            <dd>
              <input v-model="submitData.ext_02" name="ext_02" type="date" />
            </dd>
          </dl>
          <dl>
            <dt>File</dt>
            <dd>
              <input
                type="file"
                name="ext_03"
                @change="uploadFile($event, 'ext_03')"
              />
            </dd>
          </dl>
        </div>

        <button @click.prevent="handleOnSubmit">Submit</button>
      </form>
    </section>
  </div>
</template>

<script setup>
const FORM_ID = 21; // Form ID
const submitted = ref(false);
const submitData = ref({});
const error = ref(null);
const file_id = ref(null);
const response = ref({ details: {} });
const config = useRuntimeConfig();
const getForm = async () => {
  const formData = await $fetch(`/rcms-api/22/form/${FORM_ID}`, {
    method: "GET",
    baseURL: config.public.apiBase,
    credentials: "include",
  });
  console.log(formData);
  response.value = formData;
};
const textLines2texts = (textLines = "") => {
  return textLines.split("\r\n");
};
//Set_file_id
const uploadFile = async (e, key) => {
  const fm = new FormData();
  fm.append("file", e.target.files[0]);
  const res = await $fetch(`/rcms-api/22/file`, {
    method: "POST",
    baseURL: config.public.apiBase,
    credentials: "include",
    body: fm,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  file_id.value = res.file_id;
  submitData.value = {
    ...submitData.value,
    [key]: { file_id: file_id.value },
  };
};
const handleOnSubmit = async () => {
  //Post processing to Kuroco endpoints
  try {
    await $fetch("/rcms-api/22/form", {
      method: "POST",
      baseURL: config.public.apiBase,
      credentials: "include",
      body: submitData.value || {},
    });
    submitted.value = true;
    error.value = null;
  } catch (e) {
    error.value = e.response._data.errors;
  }
};
await getForm();
</script>