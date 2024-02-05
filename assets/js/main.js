
const hamburgerMenu = document.querySelector('.hamburger-menu');
const menu = document.querySelector('.menu');
const menuLinks = document.querySelectorAll('.menulink');
const subMenuToggles = document.querySelectorAll('.sub-menu-toggle');
    


// Toggle Hamburger Menu
hamburgerMenu.addEventListener('click', () => {
  hamburgerMenu.classList.toggle('active');
  menu.classList.toggle('active');
});

// Close Hamburger Menu on Link Click
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburgerMenu.classList.remove('active');
    menu.classList.remove('active');
  });
});

// Toggle Submenus
subMenuToggles.forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    const subMenu = toggle.querySelector('.sub-menu');
    subMenu.classList.toggle('active');
    console.log(subMenu)
    // Close Other Submenus
    const siblings = Array.from(toggle.parentNode.children).filter(child => child !== toggle && child.classList.contains('sub-menu-toggle'));
    siblings.forEach(sibling => {
      ul=sibling.querySelector('.sub-menu')
      ul.classList.remove('active');
      const relicon = sibling.querySelector('.fas');
      relicon.classList.add('fa-plus')
      relicon.classList.remove('fa-minus')
     // Remove active class from sub-menus
    });

    // Toggle Plus/Minus Icon
    const icon = toggle.querySelector('.fas');
    icon.classList.toggle('fa-plus');
    icon.classList.toggle('fa-minus');
  });
});


  // get the elements we need
// Get the envelope icon and dropdown menu
const envelopeIcons = document.querySelectorAll('.fa-envelope');

// Show the dropdown menu when any envelope icon is clicked
envelopeIcons.forEach(envelopeIcon => {
  envelopeIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    const dropdownMenu = event.target.closest('a').nextElementSibling;
    if (dropdownMenu.classList.contains('dropdown-menu')) {
      console.log(envelopeIcons)
      dropdownMenu.classList.toggle('show');
    }
  });
});

// Hide the dropdown menu when the user clicks outside of it
document.addEventListener('click', (event) => {
  if (!Array.from(document.querySelectorAll('.dropdown-menu.show')).some(dropdownMenu => dropdownMenu.contains(event.target)) &&
      !Array.from(envelopeIcons).some(envelopeIcon => envelopeIcon.contains(event.target))) {
    document.querySelectorAll('.dropdown-menu.show').forEach(dropdownMenu => {
      dropdownMenu.classList.remove('show');
    });
  }
});














