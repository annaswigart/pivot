<div class="row">
  <div ng-if="resultsLoading" ng-include="'client/templates/loading.tpl'"></div>

  <div class="col-xs-8 col-xs-offset-2 cta-search-box" ng-if="!resultsLoading">

    <form class="form-horizontal" onsubmit="this.reset(); return false;" name="homeQuery" role="form">
      <div class="form-group">

        <div class="col-xs-10 col-xs-offset-1">

          <label class="search-label">
            Explore career profiles. Find a better career.
          </label>

          <ul class="opts">
            <li ng-class='{"optSelect":searchType==skill}' ng-click="searchType=skill" data-placeholder="Skill">Skill</li>
            <li ng-class='{"optSelect":searchType==industry}' ng-click="searchType=industry" data-placeholder="Industry">Industry</li>
            <li ng-class='{"optSelect":searchType==title}' ng-click="searchType=title" data-placeholder="Job Title or Career Name">Title</li>
          </ul>

          <div class="input-group input-group-lg">
            <input type="text" name="text" class="form-control" placeholder="placeholder text" ng-model="searchQuery"/>
            <span class="input-group-btn">
              <button ng-click="setQuery(searchQuery)" class="btn btn-primary" aria-label="search" ui-sref="results(query)">
                <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
              </button>
            </span>
          </div>

        </div>

      </div>
    </form>

  </div>
</div>