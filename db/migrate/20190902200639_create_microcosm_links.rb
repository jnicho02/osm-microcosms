class CreateMicrocosmLinks < ActiveRecord::Migration[5.2]
  def change
    create_table :microcosm_links do |t|
      t.integer :microcosm_id
      t.string :site
      t.string :url

      t.timestamps
    end
  end
end
