Feature: Administer a Microcosm
  In order to administer microcosms
  as an administrator
  I want to create the microcosm

  Background:
    Given there is a microcosm "MappingDC", "Washington, DC, USA", "38.9", "-77.03", "38.516 * 10**7", "39.472 * 10**7", "-77.671 * 10**7", "-76.349 * 10**7"
    And the microcosm has description "MappingDC strives to improve OSM in the DC area"
    And the microcosm has the "Facebook" page "https://facebook.com/groups/mappingdc"
    And the microcosm has the "Twitter" page "https://twitter.com/mappingdc"
    And the microcosm has the "Website" page "https://mappingdc.org"
    And I am on the microcosm "MappingDC" page


  Scenario: Create a microcosm
    Given there is a user "abe@example.com" with name "Abe"
    And "abe@example.com" is an administrator
    When user "abe@example.com" logs in
    And I am on the microcosms page
    And I click "new microcosm"
    And I set the microcosm to "#new_microcosm", "Baltimore", "38", "-77"
    And I submit the form
    Then I should see "Baltimore"


  Scenario: Edit a microcosm
    Given there is a user "abe@example.com" with name "Abe"
    And "abe@example.com" is an administrator
    When user "abe@example.com" logs in
    And I am on the microcosms page
    And I click the link to "/microcosms/mappingdc/edit"
    And I set the microcosm to ".edit_microcosm", "Baltimore", "40", "-76"
    And I submit the form
    Then I should not see "Washington, DC, USA"
    Then I should see "Baltimore"
