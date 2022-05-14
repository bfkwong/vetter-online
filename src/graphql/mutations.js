import { API } from "aws-amplify";

export async function createPatient(input) {
  const mutation = `
  mutation MyMutation {
    createPatient(input: {cardCVV: "${input.cardCVV}", cardExpDate: "${input.cardExpDate}", cardNum: "${input.cardNum}", name: "${input.name}", cognitoId: "${input.cognitoId}"}) {
      id
      cognitoId
      cardNum
      cardExpDate
      cardCVV
      name
    }
  }
  `;
  const patient = await API.graphql({ query: mutation });
  return patient;
}

export async function createVet(input) {
  const mutation = `
  mutation MyMutation {
    createVet(input: {name: "${input.name}", specialty: "${input.specialty}", cognitoId: "${input.cognitoId}"}) {
      name
      id
      specialty
    }
  }`;
  const vet = await API.graphql({ query: mutation });
  return vet;
}

export async function createPet(input) {
  const mutation = `
  mutation MyMutation {
    createPet(input: {patientID: "${input.patientID}", name: "${input.name}", petVetId: "${input.petVetId}", species: "${input.species}", weight: ${input.weight}, breed: "${input.breed}", birthday: "${input.birthday}"}) {
      id
      name
      breed
      birthday
      patientID
      petVetId
      species
      weight
    }
  }`;
  const pet = await API.graphql({ query: mutation });
  return pet;
}

export async function createVisit(input) {
  const mutation = `
  mutation MyMutation {
    createVisit(input: {videoLink: "${input.videoLink}", petId: "${input.petId}", vetId: "${input.vetId}", visitTime: "${input.visitTime}", visitReason: "${input.visitReason}", patientId: "${input.patientID}", petName: "${input.petName}"}) {
      id
    }
  }`;
  const visit = await API.graphql({ query: mutation });
  return visit;
}

export async function updateVisitNotes(visitId, visitNote) {
  const mutation = `mutation MyMutation {
    updateVisit(input: {id: "${visitId}", visitNotes: "${visitNote}"}) {
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
  const visit = await API.graphql({ query: mutation });
  return visit;
}

export async function updateVisitReason(visitId, visitReason) {
  const mutation = `mutation MyMutation {
    updateVisit(input: {id: "${visitId}", visitReason: "${visitReason}"}) {
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
  const visit = await API.graphql({ query: mutation });
  return visit;
}

export async function deleteVisit(visitId) {
  const mutation = `mutation MyMutation {
    deleteVet(input: {id: "${visitId}"}) {
      id
    }
  }`;
  const visit = await API.graphql({ query: mutation });
  return visit;
}

export async function createPrescription(input) {
  const mutation = `mutation MyMutation {
    createPrescription(input: {instruction: "${input.instruction}", medicine: "${input.medicine}", visitID: "${input.visitID}"}) {
      id
      instruction
      medicine
      updatedAt
      visitID
    }
  }`;
  const prescription = await API.graphql({ query: mutation });
  return prescription;
}

export async function deletePrescription(prescriptionId) {
  const mutation = `mutation MyMutation {
    deletePrescription(input: {id: "${prescriptionId}"}) {
      id
    }
  }`;
  const prescription = await API.graphql({ query: mutation });
  return prescription;
}

export async function updatePrescription(input) {
  const mutation = `mutation MyMutation {
    updatePrescription(input: {id: "${input.id}", medicine: "${input.medicine}", instruction: "${input.instruction}"}) {
      id
    }
  }`;
  const prescription = await API.graphql({ query: mutation });
  return prescription;
}

export async function createInvoice(input) {
  const mutation = `mutation MyMutation {
    createInvoice(input: {patientId: "${input.patientId}", vetId: "${input.vetId}", visitId: "${input.visitId}", dateSent: "${input.dateSent}", amount: "${input.amount}"}) {
      id
      visitId
      vetId
      patientId
      dateSent
      datePaid
      amount
    }
  }`;
  const invoice = await API.graphql({ query: mutation });
  return invoice;
}

export async function deleteInvoice(invoiceId) {
  const mutation = `mutation MyMutation {
    deleteInvoice(input: {id: "${invoiceId}"}) {
      id
    }
  }`;
  const invoice = await API.graphql({ query: mutation });
  return invoice;
}

export async function updateInvoiceAmount(invoiceId, amount) {
  const mutation = `mutation MyMutation {
    updateInvoice(input: {amount: "${amount}", id: "${invoiceId}"}) {
      id
    }
  }`;
  const invoice = await API.graphql({ query: mutation });
  return invoice;
}

export async function updateInvoiceDatePaid(invoiceId, datePaid) {
  const mutation = `mutation MyMutation {
    updateInvoice(input: {id: "${invoiceId}", datePaid: "${datePaid}"}) {
      id
      amount
      dateSent
      datePaid
    }
  }`;
  const invoice = await API.graphql({ query: mutation });
  return invoice;
}

export async function launchStripe(input) {
  const body = {
    body: {
      customerId: input.patientId,
      userId: input.patientId,
      clinicId: input.vetId,
      productInfo: [
        {
          productName: "Vet fee",
          itemPrice: input.amount,
          itemQuantity: 1
        }
      ]
    }
  };

  const route = new URL("https://ai60873pli.execute-api.us-west-2.amazonaws.com/prod/new");
  const response = await fetch(route, {
    method: "POST",
    body: JSON.stringify(body)
  });

  const json = await response.json();
  return json;
}
