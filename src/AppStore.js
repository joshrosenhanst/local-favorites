import { findIndex as _findIndex } from 'lodash'

const AppStore = {
  state: {
    isLoading: false,
    resultsList: [],
    savedReviews: [],
    selectedPlace: {},
    activeTab: 0
  },
  /*
    Set the isLoading boolean.
  */
  setIsLoading: function (value) {
    this.state.isLoading = value
  },

  /*
    Set the activeTab value.
  */
  setActiveTab: function (value) {
    this.state.activeTab = value
  },

  /*
    Update the selectedPlace object with a new Place. To maintain Vue reactivity, the new place should be created using Object.assign()
  */
  setSelectedPlace: function (newPlace) {
    this.state.selectedPlace = newPlace
  },

  /*
    Replace the full resultsList array.
  */
  setResultsList: function (newList) {
    this.state.resultsList = newList
  },

  /*
    Find the review in savedReviews array using the place_id property and update the review. This function will also create a new array item if it isn't found.
  */
  setReview: function (placeId, newReview) {
    // look up the review place_id in savedReviews
    let reviewIndex = _findIndex(this.state.savedReviews, { place_id: placeId })

    // update the entry in savedReview (splice replaces the item in the array, which maintains Vue reactivity), or add the object if it doesn't exist
    if (reviewIndex >= 0) {
      this.state.savedReviews.splice(reviewIndex, 1, newReview)
    } else {
      this.state.savedReviews.push(newReview)
    }
  },

  /*
    Find the result in resultsList array using the placeId paramter and update the review. Update only, do not create a new item.
  */
  updateResult: function (placeId, newValues) {
    // look up the review place_id in resultsList
    let resultIndex = _findIndex(this.state.resultsList, { place_id: placeId })

    // splice the new object into the resultsList array
    if (resultIndex >= 0) {
      let newResult = Object.assign({}, this.state.resultsList[resultIndex], newValues)
      this.state.resultsList.splice(resultIndex, 1, newResult)
    }
  },

  /*
    Add a new result to the front of the resultList array using unshift
  */
  addFirstResult: function (newResult) {
    this.state.resultsList.unshift(newResult)
  }
}

export default AppStore
