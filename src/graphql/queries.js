import { API } from "aws-amplify";

export async function searchPatient(cognitoId) {
  const query = `
  query MyQuery {
    searchPatients(filter: {cognitoId: {eq: "${cognitoId}"}}) {
      items {
        id
        name
        owner
        cardNum
        cardExpDate
        cardCVV
      }
    }
  }`;
  const patient = await API.graphql({ query });
  return patient;
}

export async function searchVet(cognitoId) {
  const query = `
  query MyQuery {
    searchVets(filter: {cognitoId: {eq: "${cognitoId}"}}) {
      items {
        id
        name
        specialty
      }
    }
  }
  `;
  const vet = await API.graphql({ query });
  return vet;
}

export async function searchVetsBySpecialty(specialty) {
  const query = `
  query MyQuery {
    searchVets(limit: 4, filter: {specialty: {wildcard: "*${specialty}*"}, createdAt: {gt: "2022-05-13T00:00:36.992Z"}}) {
      items {
        id
        name
        specialty
      }
    }
  }`;
  const vet = await API.graphql({ query });
  return vet;
}

export async function listPetsByPatient(patientId) {
  if (patientId) {
    const query = `
    query MyQuery {
      listPets(filter: {patientID: {eq: "${patientId}"}}) {
        items {
          name
          id
          species
          breed
        }
      }
    }`;
    const vet = await API.graphql({ query });
    return vet;
  }
}

export async function listVisits(patientId) {
  const query = `query MyQuery {
    listVisits(filter: {patientId: {eq: "${patientId}"}}) {
      items {
        id
        petId
        petName
        vetId
        visitTime
        visitReason
        videoLink
      }
    }
  }`;
  const visits = await API.graphql({ query });
  return visits;
}

export async function getVisit(visitId) {
  const query = `query MyQuery {
    getVisit(id: "${visitId}") {
      id
      petId
      petName
      updatedAt
      vetId
      visitNotes
      visitReason
      visitTime
      videoLink
    }
  }`;
  const visit = await API.graphql({ query });
  return visit;
}

export async function getVet(vetId) {
  const query = `query MyQuery {
    getVet(id: "${vetId}") {
      name
      id
      specialty
    }
  }`;
  const vet = await API.graphql({ query });
  return vet;
}

export async function listPrescriptions(visitId) {
  const query = `query MyQuery {
    listPrescriptions(filter: {visitID: {eq: "${visitId}"}}) {
      items {
        id
        instruction
        medicine
      }
    }
  }`;
  const prescr = await API.graphql({ query });
  return prescr;
}

export async function getPet(petId) {
  const query = `query MyQuery {
    getPet(id: "${petId}") {
      birthday
      breed
      id
      name
      patientID
      petVetId
      species
      weight
    }
  }`;
  const pet = await API.graphql({ query });
  return pet;
}

export async function listVisitsByPetId(petId) {
  const query = `query MyQuery {
    listVisits(filter: {petId: {eq: "${petId}"}}) {
      items {
        id
        visitTime
        visitReason
        visitNotes
      }
    }
  }`;
  const pets = await API.graphql({ query });
  return pets;
}

export async function listVisitsByVetId(vetId) {
  const query = `query MyQuery {
    listVisits(filter: {vetId: {eq: "${vetId}"}}) {
      items {
        id
        visitTime
        visitReason
        petName
      }
    }
  }`;
  const visits = await API.graphql({ query });
  return visits;
}

export async function getZoomLink(startTime) {
  const route = new URL("https://p5e6poajoh.execute-api.us-west-2.amazonaws.com/prod/zoomlink");
  const response = await fetch(route, {
    method: "POST",
    body: JSON.stringify({
      body: {
        startTime
      }
    })
  });

  const json = await response.json();
  return json;
}

export async function listInvoicesByVisit(visitId) {
  const query = `query MyQuery {
    listInvoices(filter: {visitId: {eq: "${visitId}"}}) {
      items {
        id
        amount
        dateSent
        datePaid
      }
    }
  }`;
  const invoice = await API.graphql({ query });
  return invoice;
}

export async function listInvoicesByVetId(vetId) {
  const query = `query MyQuery {
    listInvoices(filter: {vetId: {eq: "${vetId}"}}) {
      items {
        id
        amount
        dateSent
        datePaid
        visitId
      }
    }
  }`;
  const invoice = await API.graphql({ query });
  return invoice;
}
