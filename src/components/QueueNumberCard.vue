<template>
  <MDBCard class="w-50 m-2" bg="info" text="white">
    <MDBCardBody>
      <MDBCardTitle>Queue Number</MDBCardTitle>
      <MDBCardText>
        <div class="display-1"><slot /></div>
      </MDBCardText>
    </MDBCardBody>
  </MDBCard>
</template>

<script>
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
} from "mdb-vue-ui-kit";
export default {
  components: {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
  },
};
</script>

<style></style>
