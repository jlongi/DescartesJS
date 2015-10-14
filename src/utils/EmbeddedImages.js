/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Get the embedded image of the license used in Arquimedes
   * @return {Image} return the image of the license used in Arquimedes
   */
  descartesJS.getCreativeCommonsLicenseImage = function() {
    var img = new Image();
    img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAAfCAMAAABUFvrSAAAAA3NCSVQICAjb4U/gAAAB/lBMVEX///////////8AAAANDA0NDg0ODg4QEBAZGRkbGxsfGxwgICAjHyAkJCQoJSYoKCgoKSgpKSkpKikqJycqKiotLS0wMDAxLS4yMTEyMzE1NjU+Pz4/Nzk/OzxAQEBDRENQUFBQUVBaV1hdXl1gYGBjX2FoZWZubGxwcHBwcm91cnN2c3R4dXZ5fHl6fXl8f3x9f3x+e3x/gX6AgICChYKEgYKEhYSEhoSHhoeJjImMiouOh4uPj4+Rj4+Rk5GRlJGTmJOVmZSWmZaYlpeamJmenZ2eoJ2flpqfn5+fo56ipqGjoaGjqKOmqqarsaqsq6ussquts6yus62utK2vr6+vsq+vtK6vta6ws6+wta+wtq+xt7Cyt7GyuLGzuLK0ubO0urO1tbW1urS2u7W3vLa4vbe5vri5vrm6ubm6v7m6v7q7wLq7wLu8wLy8wbu8wby9wry9wr2+wr2+w76/v7+/w76/xL7AxL/Axb/AxcDBxcDCx8LDx8LDyMPEx8PEyMPEycTFycTFycXGysXGysbHy8fIx8fIzMfIzMjJyMjJzcjJzcnKzcnLysvLzsrLz8rLz8vMz8vM0MvM0MzN0MzN0czN0c3O0c3O0s7Pz8/P08/Q08/Q1NDR1NDR1NHS1dHS1dLT1tLW1dXf39/g3+Dj4+Po5+fv7+/x8fH///+utJ0VAAAAA3RSTlMACg7nIQFTAAAD4UlEQVRIx7WWj3fTVBTHq5dSZp/SonbqJOtGhWKdTONA1HWADIfourHpdMOhW9dtTuqEDmbsKBhZpMOUtroCIWxtre37L71J2vw69UyLvNOctN/kft573/vefXU8DU+kORwAM9FY/Aq3xgsbYjafz2buCHyKW4nPR2emp74cGx0dGf7vDcnIXVy+luTTmYIkbxeL24+kwt00n1xdXlTIE2OjIy2RHYDcH1O3xIJ8tNOpTMLZeUy+lxFucD8g+avJifOjIz1e5YG3x4jbUUFwDLlCTgq3GQa1DUj59E1ueT568cLk2EkPABMMMgCeE1rUiZ0VBMevpYS83IU8V4BNJNiAC792Xf8jfWM1Hpudnvp4N/jLFFvZD7vVqLP/QkHwleStnMJ1sVWqtSFEe67nheTK0tzMBS8EUANQHoBHCfKoSn+3Tamsr1d0BcEcL0rI9ZWp3qo+HLOU4bnl2Gwv+EsNMPUDetgDL51G7p5doYqu4DvnCLaFuqKA134thJFbpdRKHriXTl1diu4DU49l8A4Pe+E5sv8gsO9CRFfKdJ28+lqIkH5NUcB8Rm4D131qaVUXtMl3ee77GDDK7wCo06cMYAzz+hs4uFClZCi09hF5n9JB0q4pCljYPArAUlsbAjhWEJKXFyFIVSc0L4IKBpX1EAqhkqHUniV70WZC/lIVBbzxoBNcaETCzzCsdvsAA1zQKd1BL5qDkRFqJ6R7QVe+eTGhgv/UwaLsVKaZUFcwM67eAsrknY8yN1e/a2YFfqkN0pKSrf0NZeHcbUojhBhWZLcAcIg+cJcT7iEfLo9x95DqxXaW5+IvaMnTBqyninaT9nYIRd56pqEMEtLX9zz50EhergiQUCJZDVC3G2dQzP/Cxd8GP7UvN1QqfXt29dfMSp8ygUM1Y7ntAJ7bZ2yQoHmDvNdtU36LREq6YrGiet/NohXKzbBi7tNWt3Q9efWs6ckLglMWMXlzX3+CdcsXCPqMknPWs6OiLrcucFF9uY0z6o26cbltpK5+G7049fmbLZVNYTOsetFsg/x0eX52enKshUMEwT+rW7r8T1saa32LYCxCZ5oVoXAhvbayhKV+4vxIS2A4IkoHkGwqQ2W1bIrvPNYxjdfh7ENzoa+yWOhfkXNH4HHB0Jt/eMB2NMm/n9Lf0fYHaJemaBelYHuJWsHQm5XOmA/TsJQ7ZYqpf6iJUv9t6coiaGA4jMd/uHH8D8gF0exDo2yau6KWjhp9UWoHw8ufZTYfyFvF4paMf1i+6LDE2Ixo2EAtmm0KDl3vOH5JzOZyWfHS8Q5rHpqN2O5xIw9NwP/3v8KnnhD3b1lluBxHejSEAAAAAElFTkSuQmCC";
    return img;
  }

  return descartesJS;
})(descartesJS || {});