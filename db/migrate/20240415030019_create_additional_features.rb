class CreateAdditionalFeatures < ActiveRecord::Migration[7.0]
  def change
    create_table :additional_features do |t|
      t.text :features

      t.timestamps
    end
  end
end
