class CreateMedia < ActiveRecord::Migration[7.0]
  def change
    create_table :mediums do |t|
      t.string :type
      t.text :properties

      t.timestamps
    end
  end
end
