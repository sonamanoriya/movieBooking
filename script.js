document.addEventListener("DOMContentLoaded", () => {
  console.log("Ready For Code !!!");

  const movieCards = document.querySelectorAll(".movie-card");
  const nextBtn = document.getElementById('nextBtn');
  const nextBtn2 = document.getElementById('nextToPayment');
  const confirmBookingBtn = document.getElementById('confirmBooking');
  const backToHomeBtn = document.getElementById('backToHome');

  let selectedMovie = null;
  let selectedSeat = null;
  let selectedTime = null;
  let selectedPaymentMethod = null;

  // Handle movie selection
  movieCards.forEach(card => {
    card.addEventListener("click", () => {
      movieCards.forEach(c => c.removeAttribute('data-selected')); // Remove selection from others
      card.setAttribute('data-selected', 'true');

      selectedMovie = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: card.dataset.price,
        theater: card.dataset.theater
      };

      nextBtn.disabled = false;
    });
  });

  // Show selected movie in Step 2
  function showSelectedMovieInStep2() {
    const movie = JSON.parse(localStorage.getItem('selectedMovie'));
    const detailsDiv = document.getElementById('movieDetails');
    if (movie && detailsDiv) {
      detailsDiv.innerHTML = `
        <h3 style="text-transform: capitalize;">${movie.name}</h3>
        <p><strong>Theater:</strong> ${movie.theater}</p>
        <p><strong>Price:</strong> ₹${movie.price}</p>
      `;
    }
  }

  // Handle "Next" from Step 1
  nextBtn.addEventListener('click', () => {
    if (selectedMovie) {
      localStorage.setItem('selectedMovie', JSON.stringify(selectedMovie));
      console.log('Saved to localStorage:', selectedMovie);
      toggleSteps('step1', 'step2');
      showSelectedMovieInStep2();
    }
  });

  // Seat selection
  document.querySelectorAll('.seat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.seat-btn').forEach(b => b.classList.remove('selected-seat'));
      btn.classList.add('selected-seat');
      selectedSeat = btn.innerText;
    });
  });

  // Timing selection
  document.getElementById('timing').addEventListener('change', (e) => {
    selectedTime = e.target.value;
    nextBtn2.disabled = false;
  });

  // Proceed to payment
  nextBtn2.addEventListener('click', () => {
    if (selectedSeat && selectedTime) {
      localStorage.setItem('selectedSeat', selectedSeat);
      localStorage.setItem('selectedTime', selectedTime);
      toggleSteps('step2', 'step3');
      showAllBookingDetails();
    }
  });

  // Show booking summary
  function showAllBookingDetails() {
    const movie = JSON.parse(localStorage.getItem('selectedMovie'));
    const seat = localStorage.getItem('selectedSeat');
    const time = localStorage.getItem('selectedTime');
    const summary = document.getElementById('bookingSummary');

    if (summary) {
      summary.innerHTML = `
        <h3>Movie: ${movie?.name}</h3>
        <p><strong>Theater:</strong> ${movie?.theater}</p>
        <p><strong>Price:</strong> ₹${movie?.price}</p>
        <p><strong>Seat:</strong> ${seat}</p>
        <p><strong>Time:</strong> ${time}</p>
      `;
    }
  }

  // Handle payment selection
  document.querySelectorAll('input[name="payment"]').forEach(option => {
    option.addEventListener('change', () => {
      selectedPaymentMethod = option.value;
      confirmBookingBtn.disabled = false;
    });
  });

  // Final confirmation
  confirmBookingBtn.addEventListener('click', () => {
    if (selectedPaymentMethod) {
      localStorage.setItem('selectedPaymentMethod', selectedPaymentMethod);
      showConfirmationPage();
    }
  });

  function showConfirmationPage() {
    const movie = JSON.parse(localStorage.getItem('selectedMovie'));
    const seat = localStorage.getItem('selectedSeat');
    const time = localStorage.getItem('selectedTime');
    const payment = localStorage.getItem('selectedPaymentMethod');
    const confirmation = document.getElementById('confirmationMessage');

    if (confirmation) {
      confirmation.innerHTML = `
        <h3 style="color: green;">🎉 Your booking is confirmed! 🎉</h3>
        <p><strong>Movie:</strong> ${movie?.name}</p>
        <p><strong>Theater:</strong> ${movie?.theater}</p>
        <p><strong>Price:</strong> ₹${movie?.price}</p>
        <p><strong>Seat:</strong> ${seat}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Payment Method:</strong> ${payment}</p>
      `;
    }

    toggleSteps('step3', 'confirmation');
  }

  // Back to Home
  backToHomeBtn.addEventListener('click', () => {
    localStorage.clear();
    ['step2', 'step3', 'confirmation'].forEach(id => document.getElementById(id).style.display = 'none');
    document.getElementById('step1').style.display = 'block';
    nextBtn.disabled = true;
    confirmBookingBtn.disabled = true;
  });

  // Utility function for step transitions
  function toggleSteps(hideId, showId) {
    document.getElementById(hideId).style.display = 'none';
    document.getElementById(showId).style.display = 'block';
  }
});
